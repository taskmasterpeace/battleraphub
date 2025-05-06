import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

export const imageSchema = z
  .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
    message: "Image is required",
  })
  .refine((files) => {
    const file = files?.[0];
    return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "Only JPEG, JPG, PNG, SVG and WEBP images are allowed")
  .refine((files) => {
    const file = files?.[0];
    return file && file.size <= MAX_FILE_SIZE;
  }, "Image size must be less than 5MB");

export const optionalImageSchema = z
  .custom<FileList>((val) => val instanceof FileList, {
    message: "Invalid file input",
  })
  .refine(
    (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
    "Only JPEG, JPG, PNG, SVG and WEBP images are allowed",
  )
  .refine(
    (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
    "Image size must be less than 5MB",
  )
  .optional();

export const formBattlerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tags: z
    .array(z.string())
    .min(1, "Select at least one tag")
    .refine((items) => new Set(items).size === items.length, {
      message: "Tags must be unique",
    }),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

export const formBattlerCreateSchema = formBattlerSchema.extend({
  avatar: imageSchema,
  banner: imageSchema,
});

export const formBattlerUpdateSchema = formBattlerSchema.extend({
  avatar: optionalImageSchema,
  banner: optionalImageSchema,
});
