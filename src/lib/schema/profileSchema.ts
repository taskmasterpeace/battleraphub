import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

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

export const formProfileSchema = z.object({
  avatar: optionalImageSchema.optional(),
  image: optionalImageSchema.optional(),
  name: z.string().min(3, "Name is required").max(100, "Name cannot exceed 100 characters"),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  website: z
    .string()
    .url("Invalid WEBSITE URL")
    .startsWith("https://", "Must be a valid URL")
    .or(z.string().startsWith("https://", "Must be a valid website URL"))
    .optional()
    .or(z.literal("")),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
});

export const socialMediaLinksSchema = z.object({
  twitter: z
    .string()
    .url("Invalid Platform X URL")
    .startsWith("https://", "Must be a valid URL")
    .optional()
    .or(z.literal("")),
  youtube: z
    .string()
    .url("Invalid YouTube URL")
    .startsWith("https://", "Must be a valid URL")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .startsWith("https://", "Must be a valid URL")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Invalid WEBSITE URL")
    .startsWith("https://", "Must be a valid URL")
    .optional()
    .or(z.literal("")),
});
