"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formBattlerCreateSchema, formBattlerUpdateSchema } from "@/lib/schema/formBattlerSchema";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { MultiSelect } from "@/components/multi-select";
import { SubmitButton } from "@/components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DB_TABLES } from "@/config";
import { Battlers, TagsOption } from "@/types";
import { createBattlersAction, editBattlersAction } from "@/app/actions";
import ImageUploader from "@/components/pages/battlers/admin-table/ImageUploader";
import { Loader } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

type FormCreateDataType = z.infer<typeof formBattlerCreateSchema>;
type FormUpdateDataType = z.infer<typeof formBattlerUpdateSchema>;

interface FormBattlersProps {
  createBattler?: boolean;
  setPopoverOpen?: (value: boolean) => void;
  setOpenClose: (value: boolean) => void;
  fetchBattlersList: () => void;
  battlerData?: Battlers;
}

const FormBattlers = ({
  createBattler,
  fetchBattlersList,
  setPopoverOpen,
  battlerData,
  setOpenClose,
}: FormBattlersProps) => {
  const [tagsData, setTagsData] = useState<TagsOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [currentBanner, setCurrentBanner] = useState<string>("");

  const selectedTagIds = battlerData?.battler_tags?.map((tag) => tag.tags?.id.toString());

  const form = useForm<FormCreateDataType | FormUpdateDataType>({
    resolver: zodResolver(createBattler ? formBattlerCreateSchema : formBattlerUpdateSchema),
    defaultValues: {
      name: "",
      tags: [],
      location: "",
      bio: "",
      avatar: undefined,
      banner: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  console.log("errors", errors);

  useEffect(() => {
    if (!createBattler && battlerData) {
      setValue("name", battlerData.name || "");
      setValue("tags", battlerData.battler_tags?.map((t) => t.tags?.id.toString()) || []);
      setValue("location", battlerData.location || "");
      setValue("bio", battlerData.bio || "");
      setCurrentAvatar(battlerData.avatar || "");
      setCurrentBanner(battlerData.banner || "");
    }
  }, [createBattler, battlerData, setValue]);

  const fetchTagsData = async () => {
    const { data, error } = await supabase.from(DB_TABLES.TAGS).select("*");
    if (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to fetch tags. Please try again.");
    } else {
      setTagsData(data || []);
    }
  };

  useEffect(() => {
    fetchTagsData();
  }, []);

  const tagOptions = tagsData.map((tag) => ({
    label: tag.name,
    value: tag.id.toString(),
  }));

  const { onSubmit, processing } = useFormSubmit<FormCreateDataType | FormUpdateDataType>(
    async (data) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("bio", data.bio);
      formData.append("tags", JSON.stringify(data.tags));

      if (!createBattler && battlerData?.id) {
        formData.append("userId", battlerData.id);
        if (currentAvatar) formData.append("currentAvatar", currentAvatar);
        if (currentBanner) formData.append("currentBanner", currentBanner);
      }

      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
      if (data.banner?.[0]) formData.append("banner", data.banner[0]);

      try {
        const response = createBattler
          ? await createBattlersAction(formData)
          : await editBattlersAction(formData);

        if (response?.success) {
          toast.success(response.message || "Operation successful");
          setOpenClose(false);
          setPopoverOpen?.(false);
          fetchBattlersList();
        }
      } catch (error) {
        console.log("error", error);
        toast.error(`Failed to ${createBattler ? "create" : "update"} battler. Please try again.`);
      }
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{createBattler ? "Create Battler" : "Edit Battler"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-8">
          {!createBattler && battlerData?.id && (
            <Input type="hidden" name="userId" value={battlerData.id} />
          )}

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <MultiSelect
                  options={tagOptions}
                  defaultValue={createBattler ? undefined : selectedTagIds}
                  onValueChange={(values) => {
                    if (!createBattler) {
                      setSelectedTags(values);
                    }
                    field.onChange(values);
                  }}
                  value={createBattler ? field.value : undefined}
                  placeholder="Select tags"
                  maxCount={4}
                  modalPopover={true}
                />
                {!createBattler && (
                  <Input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`flex ${createBattler ? "flex-col gap-3" : "justify-between items-center gap-2 relative"}`}
          >
            <FormField
              control={control}
              name="avatar"
              render={({ field }) => (
                <ImageUploader
                  label="Avatar"
                  name="Avatar"
                  field={field}
                  currentImage={currentAvatar}
                  preview={profilePreview}
                  setPreview={setProfilePreview}
                  createMode={createBattler ? true : false}
                />
              )}
            />

            <FormField
              control={control}
              name="banner"
              render={({ field }) => (
                <ImageUploader
                  label="Banner"
                  name="Banner"
                  field={field}
                  currentImage={currentBanner}
                  preview={bannerPreview}
                  setPreview={setBannerPreview}
                  createMode={createBattler ? true : false}
                />
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 items-center mt-4">
          <SubmitButton className="w-full" type="submit" disabled={processing}>
            {processing ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {createBattler ? "Creating..." : "Updating..."}
              </>
            ) : createBattler ? (
              "Create"
            ) : (
              "Edit"
            )}
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FormBattlers;
