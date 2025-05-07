"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X } from "lucide-react";
import { User } from "@/types";
import { updateUserProfileAction } from "@/app/actions";
import { formProfileSchema } from "@/lib/schema/profileSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export default function EditProfileDialog({ open, onOpenChange, user }: EditProfileDialogProps) {
  const router = useRouter();
  const avatarRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>(""); // banner
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  type FormProfileSchema = z.infer<typeof formProfileSchema>;

  const form = useForm<FormProfileSchema>({
    resolver: zodResolver(formProfileSchema),
    defaultValues: {
      avatar: undefined,
      image: undefined,
      name: "",
      bio: "",
      website: "",
      location: "",
    },
  });

  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    if (user) {
      setCurrentAvatar(user.avatar || "");
      setCurrentImage(user.image || "");
      setValue("name", user.name || "");
      setValue("bio", user.bio || "");
      setValue("website", user.website || "");
      setValue("location", user.location || "");
    }
  }, [setValue, user]);

  const onSubmit = async (data: FormProfileSchema) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      if (currentAvatar) formData.append("currentAvatar", currentAvatar);
      if (currentImage) formData.append("currentImage", currentImage);
      formData.append("userId", user.id || "");
      formData.append("name", data.name);
      formData.append("bio", data.bio || "");
      formData.append("website", data.website || "");
      formData.append("location", data.location || "");

      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
      if (data.image?.[0]) formData.append("image", data.image[0]);
      if (currentAvatar) formData.append("currentAvatar", currentAvatar);
      if (currentImage) formData.append("currentImage", currentImage);

      const response = await updateUserProfileAction(formData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error("error", error);
      toast.error(`Failed to edit profile. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[700px] pr-2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {user.id && <Input type="hidden" name="userId" value={user?.id} />}

              {/* Banner Image */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          ref={imageRef}
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            if (e.target.files && e.target.files[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setImagePreview(url);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Input type="hidden" name="currentImage" value={currentImage || ""} />
                <div className="flex border border-gray-800 my-2 h-28 object-cover rounded-lg overflow-hidden relative justify-center md:justify-start">
                  <div
                    className="cursor-pointer w-full h-full"
                    onClick={() => imageRef.current?.click()}
                  >
                    <Image
                      src={imagePreview || currentImage || "/placeholder.svg"}
                      alt={`preview`}
                      fill
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                        <Camera className="w-4 h-4" />
                        Change Banner
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            ref={avatarRef}
                            className="hidden"
                            accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                            onChange={(e) => {
                              field.onChange(e.target.files);
                              if (e.target.files && e.target.files[0]) {
                                const url = URL.createObjectURL(e.target.files[0]);
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
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 flex justify-center md:justify-start">
                    <div className="cursor-pointer" onClick={() => avatarRef.current?.click()}>
                      <Image
                        src={profilePreview || currentAvatar || "/placeholder.svg"}
                        alt={`preview`}
                        className="object-cover"
                        fill
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center gap-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {/* Display Name */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input className="text-sm " placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <div className="space-y-2">
                    <FormField
                      control={control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-gray-800 border-gray-700 text-sm "
                              placeholder="City, State"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <FormField
                      control={control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              className="bg-gray-800 border-gray-700 text-sm"
                              placeholder="https://yourwebsite.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-gray-800 border-gray-700 min-h-[100px] text-sm py-2"
                          rows={3}
                          placeholder="Tell us about yourself..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-white px-4 py-3 rounded-sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="w-auto" disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isLoading ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
