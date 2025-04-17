"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formBattlerSchema } from "@/lib/schema/formBattlerSchema";
import { z } from "zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
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
import { toast } from "sonner";

type FormDataType = z.infer<typeof formBattlerSchema>;

interface FormBattlersProps {
  createBattler?: boolean;
  setOpenClose: (value: boolean) => void;
  fetchBattlersList: () => void;
  battlerData?: Battlers;
}

const supabase = createClient();

const FormBattlers = ({
  createBattler,
  fetchBattlersList,
  battlerData,
  setOpenClose,
}: FormBattlersProps) => {
  const [tagsData, setTagsData] = useState<TagsOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTagIds = battlerData?.battler_tags?.map((tag) => tag.tags?.id.toString());
  const form = useForm<FormDataType>({
    resolver: zodResolver(formBattlerSchema),
    defaultValues: {
      name: "",
      tags: [],
      location: "",
      bio: "",
      avatar: undefined,
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

  const onSubmit = async (data: FormDataType) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("bio", data.bio);
      formData.append("tags", JSON.stringify(data.tags));

      if (!createBattler && battlerData?.id) {
        formData.append("userId", battlerData.id);
        if (currentAvatar) {
          formData.append("currentAvatar", currentAvatar);
        }
      }

      if (data.avatar && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }

      if (createBattler) {
        const response = await createBattlersAction(formData);
        if (response?.success) {
          toast.success(response.message || "Operation successful");
          setOpenClose(false);
          fetchBattlersList();
        }
      } else {
        const response = await editBattlersAction(formData);
        if (response.success) {
          toast.success(response.message);
          setOpenClose(false);
          fetchBattlersList();
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`Failed to ${createBattler ? "create" : "update"} battler. Please try again.`);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
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

          {createBattler ? (
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <MultiSelect
                    options={tagOptions}
                    onValueChange={field.onChange}
                    value={field.value}
                    placeholder="Select tags"
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <MultiSelect
                    options={tagOptions}
                    defaultValue={selectedTagIds}
                    onValueChange={(values) => {
                      setSelectedTags(values);
                      field.onChange(values);
                    }}
                    placeholder="Select tags"
                    maxCount={3}
                  />
                  <Input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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

          <FormField
            control={control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div>
                    {!createBattler && (imagePreview || currentAvatar) && (
                      <div className="my-2">
                        <Image
                          src={imagePreview || currentAvatar}
                          alt="Avatar preview"
                          className="h-20 w-24 rounded-md object-cover border hover:cursor-pointer"
                          width={64}
                          height={64}
                          onClick={handleImageClick}
                          unoptimized
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className={`${createBattler ? "cursor-pointer" : "hidden"}`}
                      accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setImagePreview(url);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!createBattler && (
            <Input type="hidden" name="currentAvatar" value={currentAvatar || ""} />
          )}
        </div>

        <DialogFooter className="flex flex-col gap-3 items-center mt-4">
          <SubmitButton
            className="w-full"
            type="submit"
            pendingText={createBattler ? "Creating..." : "Updating..."}
          >
            {createBattler ? "Create" : "Edit"}
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FormBattlers;
