"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formProfileSchema } from "@/lib/schema/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfileAction } from "@/app/actions";
import { User } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth.context";

const EditProfileForm = ({
  profileData,
  setIsEditing,
  setIsLoading,
  fetchProfileData,
}: {
  profileData: User;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProfileData: () => void;
}) => {
  const { user } = useAuth();
  const userId = user?.id;
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [profilePreview, setProfilePreview] = useState<string>("");

  type FormProfileSchema = z.infer<typeof formProfileSchema>;

  const form = useForm<FormProfileSchema>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      avatar: undefined,
      name: "",
      email: "",
      bio: "",
      twitter: "",
      youtube: "",
      instagram: "",
    },
  });

  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    if (profileData) {
      setCurrentAvatar(profileData.avatar || "");
      setValue("email", profileData.email || "");
      setValue("name", profileData.name || "");
      setValue("bio", profileData.bio || "");
      setValue("twitter", profileData.twitter || "");
      setValue("youtube", profileData.youtube || "");
      setValue("instagram", profileData.instagram || "");
    }
  }, [setValue, profileData]);

  const onSubmit = async (data: FormProfileSchema) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      if (currentAvatar) formData.append("currentAvatar", currentAvatar);
      formData.append("userId", userId || "");
      formData.append("name", data.name);
      formData.append("email", data.email || "");
      formData.append("twitter", data.twitter || "");
      formData.append("youtube", data.youtube || "");
      formData.append("instagram", data.instagram || "");
      formData.append("bio", data.bio || "");

      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
      if (currentAvatar) formData.append("currentAvatar", currentAvatar);

      const response = await updateUserProfileAction(formData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfileData();
      }
    } catch (error) {
      console.error("error", error);
      toast.error(`Failed to edit profile. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 mt-8">
            {userId && <Input type="hidden" name="userId" value={userId} />}

            <div>
              <FormField
                control={control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            console.log("url", url);
                            setProfilePreview(url);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Input type="hidden" name="currentAvatar" value={currentAvatar || ""} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-center md:justify-start">
                  {(profilePreview || currentAvatar) && (
                    <div
                      className="my-2 w-56 relative group"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Image
                        src={profilePreview || currentAvatar}
                        alt={`preview`}
                        className="h-56 w-56 rounded-full object-cover border hover:cursor-pointer"
                        width={200}
                        height={200}
                        unoptimized
                      />
                      <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Upload</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center md:justify-end gap-2 mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-white px-4 py-2 rounded"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <SubmitButton className="w-auto" type="submit" pendingText="Updating...">
                    Save Changes
                  </SubmitButton>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-sm md:text-base"
                      rows={5}
                      placeholder="Enter bio"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform X</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base"
                        placeholder="https://x.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Youtube</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base"
                        placeholder="https://youtube.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base"
                        placeholder="https://instagram.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
