import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { Upload, X, Camera, Loader } from "lucide-react";
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
import Image from "next/image";
import useSWRMutation from "swr/mutation";

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

  const { trigger: addContent, isMutating: isAdding } = useSWRMutation(
    "/api/content/add",
    async (url, { arg }: { arg: FormData }) => {
      const result = await addUserContentAction(arg);
      if (result?.success) {
        toast.success(result.message);
        reset();
        setThumbnailPreview("");
        setCurrentThumbnail("");
        onOpenChange?.(false);
        fetchContent?.();
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to add content.");
      }
      return result;
    },
  );

  const { trigger: updateContent, isMutating: isUpdating } = useSWRMutation(
    "/api/content/edit",
    async (url, { arg }: { arg: FormData }) => {
      const result = await editMediaContentAction(arg);
      if (result?.success) {
        toast.success(result.message);
        reset();
        setThumbnailPreview("");
        setCurrentThumbnail("");
        onOpenChange?.(false);
        fetchContent?.();
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update content.");
      }
      return result;
    },
  );

  const onSubmit = async (data: FormCreateDataType | FormUpdateDataType) => {
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

    if (data.thumbnail_img?.[0]) {
      formData.append("thumbnail_img", data.thumbnail_img[0]);
    }

    try {
      if (isContentCreate) {
        await addContent(formData);
      } else {
        await updateContent(formData);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to submit form.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[650px] sm:max-w-[600px] overflow-y-auto">
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
                        height={160}
                        width={540}
                        className="w-full h-full object-cover"
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

            <DialogFooter className="flex gap-3 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange?.(false);
                  reset();
                  setThumbnailPreview("");
                  setCurrentThumbnail("");
                }}
                disabled={isAdding || isUpdating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button className="h-10 px-4 py-2" type="submit" disabled={isAdding || isUpdating}>
                {isAdding || isUpdating ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isAdding
                  ? "Adding..."
                  : isUpdating
                    ? "Updating..."
                    : isContentCreate
                      ? "Add Content"
                      : "Edit Content"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
