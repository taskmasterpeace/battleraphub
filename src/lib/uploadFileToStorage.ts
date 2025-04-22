import { BUCKET_NAME } from "@/config";
import { SupabaseClient } from "@supabase/supabase-js";

export const uploadFileToStorage = async (
  supabase: SupabaseClient,
  file: File,
  pathPrefix: string,
  oldUrl?: string,
): Promise<{ publicUrl?: string; error?: string }> => {
  const timestamp = Date.now();
  const filePath = `${pathPrefix}/${file.name}_${timestamp}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });

  if (uploadError) {
    console.error(`Upload error for ${file.name}:`, uploadError);
    return { error: `Error while uploading ${file.name}` };
  }

  const { data: urlData } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  if (oldUrl) {
    const oldPath = oldUrl.split("/").slice(-2).join("/");
    await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
  }
  return { publicUrl: urlData?.publicUrl };
};
