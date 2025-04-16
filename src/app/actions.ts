"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { protectedCreateClient } from "@/utils/supabase/protected-server";
import { BUCKET_NAME, DB_TABLES, PERMISSIONS } from "@/config";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "Email and password are required");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect("error", "/reset-password", "Password update failed");
  }

  return encodedRedirect("success", "/reset-password", "Password updated successfully");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const giveUserPermissionAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return encodedRedirect("error", "/admin/user-list", "userId is required");
  }

  const { data: user, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select()
    .eq("id", userId);

  if (userError || !user?.length) {
    return encodedRedirect("error", "/admin/user-list", "User not found");
  }

  const { error: permissionError } = await supabase.from(DB_TABLES.USER_PERMISSIONS).insert({
    user_id: userId,
    permission: PERMISSIONS.COMMUNITY_MANAGER,
  });

  if (permissionError) {
    console.error("Permission error:", permissionError);
    return encodedRedirect("error", "/admin/user-list", "Failed to update user permissions");
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      permission: PERMISSIONS.COMMUNITY_MANAGER,
    },
  });

  if (updateError) {
    console.error("Update metadata error:", updateError);
    return encodedRedirect("error", "/admin/user-list", "Failed to update user metadata");
  }

  return encodedRedirect("success", "/admin/user-list", "User permissions updated successfully");
};

export const revokeUserPermissionAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return encodedRedirect("error", "/admin/user-list", "userId is required");
  }

  const { data: user, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select()
    .eq("id", userId);

  if (userError || !user?.length) {
    return encodedRedirect("error", "/admin/user-list", "User not found");
  }

  const { error: permissionError } = await supabase
    .from(DB_TABLES.USER_PERMISSIONS)
    .delete()
    .eq("user_id", userId)
    .eq("permission", PERMISSIONS.COMMUNITY_MANAGER);

  if (permissionError) {
    console.error("Permission removal error:", permissionError);
    return encodedRedirect("error", "/admin/user-list", "Failed to revoke user permissions");
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      permission: null,
    },
  });

  if (updateError) {
    console.error("Update metadata error:", updateError);
    return encodedRedirect("error", "/admin/user-list", "Failed to update user metadata");
  }

  return encodedRedirect("success", "/admin/user-list", "User permissions revoked successfully");
};

export const deleteUserAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return encodedRedirect("error", "/admin/user-list", "userId is required");
  }

  const { error: permError } = await supabase
    .from(DB_TABLES.USER_PERMISSIONS)
    .delete()
    .eq("user_id", userId);

  if (permError) {
    console.error("Failed to delete user_permissions:", permError);
    return encodedRedirect("error", "/admin/user-list", "Failed to delete user permissions");
  }

  const { error } = await supabase.from(DB_TABLES.USERS).delete().eq("id", userId);

  if (error) {
    console.error("Delete error:", error);
    return encodedRedirect("error", "/admin/user-list", "Failed to delete user");
  }

  return encodedRedirect("success", "/admin/user-list", "user deleted successfully");
};

export const createBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData?.user) {
    return encodedRedirect("error", "/admin/battlers", "User not authenticated");
  }

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const avatar = formData.get("avatar") as File;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];

  if (!name || !location || !bio || !avatar || !tags) {
    return encodedRedirect("error", "/admin/battlers", "Missing required fields");
  }

  const timestamp = new Date().getTime();
  const uploadedImageUrl = `battlers/${avatar.name}_${timestamp}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(uploadedImageUrl, avatar, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return encodedRedirect("error", "/admin/battlers", "Error while uploading image");
  }

  const { data: publicUrlData } = await supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(uploadedImageUrl);

  const { data: battlerInsertData, error: insertError } = await supabase
    .from(DB_TABLES.BATTLERS)
    .insert({
      name,
      location,
      bio,
      avatar: publicUrlData.publicUrl,
      added_by: userData.user.id,
    })
    .select("id")
    .single();

  if (insertError || !battlerInsertData?.id) {
    console.error("Insert error:", insertError);
    return encodedRedirect("error", "/admin/battlers", "Error saving battler data");
  }

  const battlerId = battlerInsertData.id;

  const tagData = tags.map((tagId) => ({
    battler_id: battlerId,
    tag_id: tagId,
  }));

  const { error: battlersError } = await supabase.from(DB_TABLES.BATTLERS_TAGS).insert(tagData);

  if (battlersError) {
    console.error("Battlers Tag insertion error:", battlersError);
    return encodedRedirect("error", "/admin/battlers", "Error saving battler tags");
  }

  return encodedRedirect("success", "/admin/battlers", "Battler created successfully");
};

export const editBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData?.user) {
    return encodedRedirect("error", "/admin/battlers", "User not authenticated");
  }

  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const avatar = formData.get("avatar") as File;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];

  if (!userId || !name || !location || !bio || !tags) {
    return encodedRedirect("error", "/admin/battlers", "Missing required fields");
  }

  let avatarUrl;

  if (avatar && avatar.size > 0) {
    const timestamp = new Date().getTime();
    const uploadedImageUrl = `battlers/${avatar.name}_${timestamp}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uploadedImageUrl, avatar, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return encodedRedirect("error", "/admin/battlers", "Error uploading new avatar");
    }

    const { data: publicUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadedImageUrl);

    avatarUrl = publicUrlData.publicUrl;
  }

  const { error: updateError } = await supabase
    .from(DB_TABLES.BATTLERS)
    .update({
      name,
      location,
      bio,
      ...(avatarUrl && { avatar: avatarUrl }),
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Update error:", updateError);
    return encodedRedirect("error", "/admin/battlers", "Error updating battler");
  }

  // Delete old tags
  await supabase.from(DB_TABLES.BATTLERS_TAGS).delete().eq("battler_id", userId);

  // Insert new tags
  const tagData = tags.map((tagId) => ({
    battler_id: userId,
    tag_id: tagId,
  }));

  const { error: tagInsertError } = await supabase.from(DB_TABLES.BATTLERS_TAGS).insert(tagData);

  if (tagInsertError) {
    console.error("Tag update error:", tagInsertError);
    return encodedRedirect("error", "/admin/battlers", "Error updating battler tags");
  }

  return encodedRedirect("success", "/admin/battlers", "Battler updated successfully");
};

export const deleteBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return encodedRedirect("error", "/admin/battlers", "userId is required");
  }

  const { error: tagError } = await supabase.from("battler_tags").delete().eq("battler_id", userId);

  if (tagError) {
    console.error("Failed to delete battler_tags:", tagError);
    return encodedRedirect("error", "/admin/battlers", "Failed to delete battler tags");
  }

  const { error } = await supabase.from(DB_TABLES.BATTLERS).delete().eq("id", userId);

  if (error) {
    console.error("Delete error:", error);
    return encodedRedirect("error", "/admin/battlers", "Failed to delete battler");
  }

  return encodedRedirect("success", "/admin/battlers", "Battler deleted successfully");
};
