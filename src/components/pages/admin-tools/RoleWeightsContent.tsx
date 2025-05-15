import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Save } from "lucide-react";
import React, { useEffect } from "react";
import { rolesWeightData } from "@/lib/static/static-data";
import { toast } from "sonner";
import RoleWeightSliderInput from "@/components/pages/admin-tools/RoleWeightSliderInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { roleWeightsSchema } from "@/lib/schema/roleWeightSchema";
import { ratingRoleWeightsActions } from "@/app/actions";
import { DB_TABLES, ROLE } from "@/config";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/auth.context";
import { RoleDataType } from "@/types";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type RoleWeightsFormValues = z.infer<typeof roleWeightsSchema>;

const RoleWeightsContent = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [roleData, setRoleData] = React.useState<RoleDataType[]>([]);
  const form = useForm<RoleWeightsFormValues>({
    resolver: zodResolver(roleWeightsSchema),
    defaultValues: {
      fan: 0,
      media: 0,
      battler: 0,
      league_owner: 0,
      admin: 0,
    },
  });
  const { setValue } = form;

  const fetchData = async () => {
    try {
      const { data: weights, error } = await supabase
        .from(DB_TABLES.RATING_ROLE_WEIGHTS)
        .select("role_id, weight");

      if (error) {
        toast.error("Failed to fetch data");
      }

      setRoleData(weights || []);
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error(error as string);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setValue("fan", roleData.find((item) => item.role_id === ROLE.FAN)?.weight || 0);
    setValue("media", roleData.find((item) => item.role_id === ROLE.MEDIA)?.weight || 0);
    setValue("battler", roleData.find((item) => item.role_id === ROLE.BATTLE)?.weight || 0);
    setValue(
      "league_owner",
      roleData.find((item) => item.role_id === ROLE.LEAGUE_OWNER_INVESTOR)?.weight || 0,
    );
    setValue("admin", roleData.find((item) => item.role_id === ROLE.ADMIN)?.weight || 0);
  }, [setValue, roleData]);

  const { onSubmit, processing } = useFormSubmit<RoleWeightsFormValues>(async (values) => {
    if (!userId) return;
    const convertedValues = Object.entries(values).reduce(
      (acc, [key, weight]) => {
        const roleEntry = rolesWeightData.find((role) => role.formKey === key);
        if (roleEntry) {
          acc[roleEntry.role_id] = weight;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    try {
      const formData = new FormData();
      formData.append("roleWeights", JSON.stringify(convertedValues));

      const data = await ratingRoleWeightsActions(formData);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save weights.");
    }
  });
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Weights Configuration</CardTitle>
          <CardDescription>
            Adjust the weight of each role to control how much influence their ratings have on the
            overall score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {rolesWeightData.map(({ key, formKey, label, backgroundColor, description }) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={formKey as keyof RoleWeightsFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RoleWeightSliderInput
                          label={label}
                          color={backgroundColor}
                          description={description}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Role Weights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default RoleWeightsContent;
