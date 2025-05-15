"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Youtube, Instagram, LinkIcon } from "lucide-react";
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
import Image from "next/image";
import PlatformX from "../../../../public/image/twitter-x.svg";
import { useFormSubmit } from "@/hooks/useFormSubmit";

interface SocialLinksSectionProps {
  user: User;
}

export default function SocialLinksSection({ user }: SocialLinksSectionProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
    setValue("website", user.website || "");
    setValue("youtube", user.youtube || "");
    setValue("twitter", user.twitter || "");
    setValue("instagram", user.instagram || "");
  }, [user, setValue]);

  const isOwnProfile = currentUser?.id === user.id;

  const { onSubmit, processing } = useFormSubmit<FormProfileSchema>(async (data) => {
    const formData = new FormData();
    formData.append("userId", user.id || "");
    formData.append("website", data.website || "");
    formData.append("youtube", data.youtube || "");
    formData.append("twitter", data.twitter || "");
    formData.append("instagram", data.instagram || "");

    try {
      const response = await updateUserProfileAction(formData);
      if (response.success) {
        toast.success("Social media links updated successfully!");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating social links:", error);
      toast.error("Failed to update social links. Please try again.");
    }
  });

  return (
    <div className="bg-background rounded-lg p-6 border border-border">
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
                      <Youtube className="w-4 h-4 mr-2 text-destructive" />
                      Youtube
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base bg-background border-border"
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
                    <FormLabel className="flex items-center gap-3">
                      <Image
                        src={PlatformX}
                        width={13}
                        height={13}
                        alt="platform-x"
                        className="filter brightness-0 dark:filter-none"
                      />
                      Platform X
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm md:text-base bg-background border-border"
                        placeholder="https://www.x.com/yourusername"
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
                        className="text-sm md:text-base bg-background border-border"
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
                      <LinkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background border-border text-sm md:text-base"
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
                disabled={processing}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={processing}>
                <Save className="w-4 h-4 mr-2" />
                {processing ? "Saving..." : "Save"}
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
              className="flex items-center text-muted-foreground hover:text-destructive transition-colors"
            >
              <Youtube className="w-5 h-5 mr-3 text-destructive" />
              Youtube channel
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-muted-foreground">
              <Youtube className="w-5 h-5 mr-3 text-muted-foreground" />
              Add your youTube channel
            </div>
          ) : null}
          {watch("twitter") ? (
            <a
              href={watch("twitter")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-muted-foreground hover:text-white transition-colors"
            >
              <Image
                src={PlatformX}
                width={14}
                height={14}
                alt="platform-x"
                className="filter brightness-0 dark:filter-none"
              />
              Platform X
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-muted-foreground gap-5">
              <Image
                src={PlatformX}
                width={14}
                height={14}
                alt="platform-x"
                className="filter brightness-0 dark:filter-none"
              />
              Add your platform X
            </div>
          ) : null}
          {watch("instagram") ? (
            <a
              href={watch("instagram")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-pink-400 transition-colors"
            >
              <Instagram className="w-5 h-5 mr-3 text-pink-500" />
              Instagram
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-muted-foreground">
              <Instagram className="w-5 h-5 mr-3 text-muted-foreground" />
              Add your instagram
            </div>
          ) : null}
          {watch("website") ? (
            <a
              href={watch("website")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <LinkIcon className="w-5 h-5 mr-3 text-muted-foreground" />
              Website
            </a>
          ) : isOwnProfile ? (
            <div className="flex items-center text-muted-foreground">
              <LinkIcon className="w-5 h-5 mr-3 text-muted-foreground" />
              Add your website
            </div>
          ) : null}
          {!watch("youtube") &&
            !watch("twitter") &&
            !watch("instagram") &&
            !watch("website") &&
            !isOwnProfile && (
              <p className="text-muted-foreground italic">No social links provided</p>
            )}{" "}
        </div>
      )}
    </div>
  );
}
