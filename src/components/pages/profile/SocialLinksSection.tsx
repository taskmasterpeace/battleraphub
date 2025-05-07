"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Youtube, Twitter, Instagram, LinkIcon } from "lucide-react";
import { User } from "@/types";
import { useAuth } from "@/contexts/auth.context";
import { updateUserProfileAction } from "@/app/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialMediaLinksSchema } from "@/lib/schema/profileSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface SocialLinksSectionProps {
  user: User;
}

export default function SocialLinksSection({ user }: SocialLinksSectionProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  type FormProfileSchema = z.infer<typeof socialMediaLinksSchema>;

  const form = useForm<FormProfileSchema>({
    resolver: zodResolver(socialMediaLinksSchema),
    defaultValues: {
      website: "",
      youtube: "",
      twitter: "",
      instagram: "",
    },
  });

  const { control, watch, handleSubmit, setValue } = form;

  useEffect(() => {
    setValue("website", user.website);
    setValue("youtube", user.youtube);
    setValue("twitter", user.twitter);
    setValue("instagram", user.instagram);
  }, [user, setValue]);

  const isOwnProfile = currentUser?.id === user.id;

  const onSubmit = async (data: FormProfileSchema) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", user.id || "");
      formData.append("website", data.website || "");
      formData.append("youtube", data.youtube || "");
      formData.append("twitter", data.twitter || "");
      formData.append("instagram", data.instagram || "");
      const response = await updateUserProfileAction(formData);
      if (response.success) {
        toast.success("Social media links updated successfully!");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating social links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Social Links</h3>
        {isOwnProfile && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {user.id && <Input type="hidden" name="userId" value={user.id} />}
            <div className="space-y-2">
              <FormField
                control={control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Youtube className="w-4 h-4 mr-2 text-red-500" />
                      Youtube
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base bg-gray-800 border-gray-700"
                        placeholder="https://youtube.com/@yourchannel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                      Twitter
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base bg-gray-800 border-gray-700"
                        placeholder="https://twitter.com/yourusername"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base bg-gray-800 border-gray-700"
                        placeholder="https://instagram.com/yourusername"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-800 border-gray-700 text-sm md:text-base"
                        placeholder="https://yourwebsite.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          {watch("youtube") ? (
            <a
              href={watch("youtube")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-red-400 transition-colors"
            >
              <Youtube className="w-5 h-5 mr-3 text-red-500" />
              YouTube Channel
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Youtube className="w-5 h-5 mr-3 text-gray-500" />
              Add your YouTube channel
            </div>
          ) : null}
          {watch("twitter") ? (
            <a
              href={watch("twitter")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-5 h-5 mr-3 text-blue-400" />
              Twitter
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Twitter className="w-5 h-5 mr-3 text-gray-500" />
              Add your Twitter
            </div>
          ) : null}
          {watch("instagram") ? (
            <a
              href={watch("instagram")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-pink-400 transition-colors"
            >
              <Instagram className="w-5 h-5 mr-3 text-pink-500" />
              Instagram
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <Instagram className="w-5 h-5 mr-3 text-gray-500" />
              Add your Instagram
            </div>
          ) : null}
          {watch("website") ? (
            <a
              href={watch("website")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-gray-100 transition-colors"
            >
              <LinkIcon className="w-5 h-5 mr-3 text-gray-400" />
              Website
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-gray-500">
              <LinkIcon className="w-5 h-5 mr-3 text-gray-500" />
              Add your website
            </div>
          ) : null}
          {!watch("youtube") &&
            !watch("twitter") &&
            !watch("instagram") &&
            !watch("website") &&
            !isOwnProfile && <p className="text-gray-500 italic">No social links provided</p>}{" "}
        </div>
      )}
    </div>
  );
}
