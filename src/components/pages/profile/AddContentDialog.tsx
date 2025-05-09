"use client";

import type React from "react";

import { useRef, useState } from "react";
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
import { MediaContent } from "@/types";
import { addUserContent } from "@/__mocks__/profile";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formAddContentSchema } from "@/lib/schema/formAddContentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onContentAdded: (content: MediaContent) => void;
}

type FormAddContentType = z.infer<typeof formAddContentSchema>;

export default function AddContentDialog({
  open,
  onOpenChange,
  userId,
  onContentAdded,
}: AddContentDialogProps) {
  const router = useRouter();
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormAddContentType>({
    resolver: zodResolver(formAddContentSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      type: "video",
      thumbnail: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  console.log("errors", errors);

  const onSubmit = async (data: FormAddContentType) => {
    console.log("data", data);
    setIsLoading(true);
    try {
      const newContent = await addUserContent(userId, {
        title: data.title,
        description: data.description,
        url: data.url,
        type: data.type,
        thumbnail: data.thumbnail?.[0] ? URL.createObjectURL(data.thumbnail[0]) : undefined,
      });

      onContentAdded(newContent);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      {/* required field */}
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
                        className=" min-h-[100px]"
                        rows={3}
                        placeholder="Enter description"
                        {...field}
                      />
                      {/* required field */}
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-content" {...field} />
                      {/* required field */}
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
                name="thumbnail"
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
                        src={thumbnailPreview || "/placeholder.svg"}
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
              />{" "}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? "Adding..." : "Add Content"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
