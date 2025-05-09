import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

export const thumbnailSchema = z
  .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
    message: "Thumbnail is required",
  })
  .refine((files) => {
    const file = files?.[0];
    return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only JPEG, JPG, PNG, SVG and WEBP images are allowed")
  .refine((files) => {
    const file = files?.[0];
    return file && file.size <= MAX_FILE_SIZE;
  }, "Thumbnail size must be less than 5MB");

export const optionalThumbnailSchema = z
  .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
    message: "Thumbnail is required",
  })
  .refine((files) => {
    const file = files?.[0];
    return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only JPEG, JPG, PNG, SVG and WEBP images are allowed")
  .refine((files) => {
    const file = files?.[0];
    return file && file.size <= MAX_FILE_SIZE;
  }, "Thumbnail size must be less than 5MB")
  .optional();

export const formContentSchema = z.object({
  type: z.enum(["video", "article", ""]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Invalid URL"),
  date: z.date().optional(),
});

export const formAddContentSchema = formContentSchema.extend({
  thumbnail_img: thumbnailSchema,
});

export const formUpdateContentSchema = formContentSchema.extend({
  thumbnail_img: optionalThumbnailSchema,
});
