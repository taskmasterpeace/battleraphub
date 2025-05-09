"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formAddContentSchema, formUpdateContentSchema } from "@/lib/schema/formAddContentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addUserContentAction, editMediaContentAction } from "@/app/actions";
import { toast } from "sonner";
import { MediaContent } from "@/types";
import { SubmitButton } from "@/components/submit-button";

interface formContentDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  isContentCreate?: boolean;
  userId?: string;
  contentData?: MediaContent;
  fetchContent?: () => void;
}
type FormCreateDataType = z.infer<typeof formAddContentSchema>;
type FormUpdateDataType = z.infer<typeof formUpdateContentSchema>;

export default function FormContentDialog({
  open,
  onOpenChange,
  isContentCreate = false,
  userId,
  contentData,
  fetchContent,
}: formContentDialogProps) {
  const router = useRouter();
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormCreateDataType | FormUpdateDataType>({
    resolver: zodResolver(isContentCreate ? formAddContentSchema : formUpdateContentSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      link: "",
      thumbnail_img: undefined,
      date: contentData?.date ? new Date(contentData.date) : new Date(),
    },
  });

  const { control, handleSubmit, setValue, reset } = form;

  useEffect(() => {
    if (!isContentCreate && contentData) {
      setValue("title", contentData.title ?? "");
      setValue("type", contentData.type ?? "");
      setValue("description", contentData.description ?? "");
      setValue("link", contentData.link ?? "");
      setCurrentThumbnail(contentData.thumbnail_img ?? "");
    }
  }, [isContentCreate, contentData, setValue]);

  const onSubmit = async (data: FormCreateDataType | FormUpdateDataType) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (userId) formData.append("userId", userId);
      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("link", data.link);
      formData.append("date", data.date?.toISOString() ?? new Date().toISOString());

      if (!isContentCreate && contentData?.id) {
        formData.append("contentId", contentData.id);
        if (currentThumbnail) formData.append("currentThumbnail", currentThumbnail);
      }

      if (data.thumbnail_img?.[0]) formData.append("thumbnail_img", data.thumbnail_img[0]);

      if (isContentCreate) {
        const response = await addUserContentAction(formData);
        if (response?.success) {
          toast.success(response.message);
          reset();
          setThumbnailPreview("");
          setCurrentThumbnail("");
          onOpenChange?.(false);
          fetchContent?.();
          router.refresh();
        } else {
          toast.error(response?.message || "Failed to create content");
        }
      } else {
        const response = await editMediaContentAction(formData);
        if (response.success) {
          toast.success(response.message);
          onOpenChange?.(false);
          fetchContent?.();
          router.refresh();
        } else {
          toast.error(response?.message || "Failed to update content");
        }
      }
    } catch (error) {
      console.error("error", error);
      toast.error(
        `Failed to ${isContentCreate ? "create" : "update"} media content. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isContentCreate ? "Add New Content" : "Edit Content"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isContentCreate && contentData?.id && (
              <Input type="hidden" name="contentId" value={contentData.id} />
            )}
            {userId && <Input type="hidden" name="user_id" value={userId} />}
            <Input type="hidden" name="date" value={new Date().toISOString()} />
            {/* Content Type */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[100px]"
                        rows={3}
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <FormField
                control={control}
                name="thumbnail_img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        ref={thumbnailRef}
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setThumbnailPreview(url);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="relative h-40 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={thumbnailPreview || currentThumbnail || "/placeholder.svg"}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 hover:opacity-100 transition-opacity">
                        <div
                          className="cursor-pointer"
                          onClick={() => thumbnailRef.current?.click()}
                        >
                          <div className="flex items-center justify-center gap-2 bg-background text-foreground px-4 py-2 rounded-md">
                            <Camera className="w-4 h-4" />
                            Upload Thumbnail
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange?.(false);
                  reset();
                  setThumbnailPreview("");
                  setCurrentThumbnail("");
                }}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <SubmitButton
                className="h-10 px-4 py-2"
                type="submit"
                pendingText={isContentCreate ? "Adding..." : "Updating..."}
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isContentCreate ? "Add Content" : "Edit Content"}
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
