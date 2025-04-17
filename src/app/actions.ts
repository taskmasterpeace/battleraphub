"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { protectedCreateClient } from "@/utils/supabase/protected-server";
import { BUCKET_NAME, DB_TABLES, PAGES, PERMISSIONS } from "@/config";
import {
  successResponse,
  errorResponse,
  redirectResponse,
  encodedRedirect,
} from "@/utils/response";

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
    return encodedRedirect("error", PAGES.SIGN_UP, error.message);
  } else {
    return encodedRedirect(
      "success",
      PAGES.SIGN_UP,
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
    return encodedRedirect("error", PAGES.LOGIN, error.message);
  }

  return redirectResponse(PAGES.PROTECTED);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return errorResponse("Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return errorResponse("Could not reset password");
  }

  if (callbackUrl) {
    return redirectResponse(callbackUrl);
  }

  return successResponse("Check your email for a link to reset your password.");
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return errorResponse("Password and confirm password are required");
  }

  if (password !== confirmPassword) {
    return errorResponse("Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return errorResponse("Password update failed");
  }
  return successResponse("Password updated successfully");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirectResponse(PAGES.LOGIN);
};

export const giveUserPermissionAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return errorResponse("userId is required");
  }

  const { data: user, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select()
    .eq("id", userId);

  if (userError || !user?.length) {
    return errorResponse("User not found");
  }

  const { error: permissionError } = await supabase.from(DB_TABLES.USER_PERMISSIONS).insert({
    user_id: userId,
    permission: PERMISSIONS.COMMUNITY_MANAGER,
  });

  if (permissionError) {
    console.error("Permission error:", permissionError);
    return errorResponse("Failed to update user permissions");
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      permission: PERMISSIONS.COMMUNITY_MANAGER,
    },
  });

  if (updateError) {
    console.error("Update metadata error:", updateError);
    return errorResponse("Failed to update user metadata");
  }
  return successResponse("User permissions updated successfully");
};

export const revokeUserPermissionAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return errorResponse("userId is required");
  }

  const { data: user, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select()
    .eq("id", userId);

  if (userError || !user?.length) {
    return errorResponse("User not found");
  }

  const { error: permissionError } = await supabase
    .from(DB_TABLES.USER_PERMISSIONS)
    .delete()
    .eq("user_id", userId)
    .eq("permission", PERMISSIONS.COMMUNITY_MANAGER);

  if (permissionError) {
    console.error("Permission removal error:", permissionError);
    return errorResponse("Failed to revoke user permissions");
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      permission: null,
    },
  });

  if (updateError) {
    console.error("Update metadata error:", updateError);
    return errorResponse("Failed to update user metadata");
  }
  return successResponse("User permissions revoked successfully");
};

export const deleteUserAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return errorResponse("userId is required");
  }

  const { error: permError } = await supabase
    .from(DB_TABLES.USER_PERMISSIONS)
    .delete()
    .eq("user_id", userId);

  if (permError) {
    console.error("Failed to delete user_permissions:", permError);
    return errorResponse("Failed to delete user permissions");
  }

  const { error } = await supabase.from(DB_TABLES.USERS).delete().eq("id", userId);
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (error || authError) {
    console.error("Delete error:", error);
    return errorResponse("Failed to delete user");
  }

  return successResponse("user deleted successfully");
};

export const markAsVerifiedAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return errorResponse("userId is required");
  }

  const { data: user, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select()
    .eq("id", userId)
    .single();

  if (userError || !user) {
    return successResponse("User not found");
  }

  const { error: updateError } = await supabase
    .from(DB_TABLES.USERS)
    .update({ verified: true })
    .eq("id", userId);

  if (updateError) {
    console.error("Verification error:", updateError);
    return errorResponse("Failed to verify user");
  }

  return successResponse("User verified successfully");
};

export const createBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();

  try {
    const { data: userData } = await supabaseClient.auth.getUser();

    if (!userData?.user) {
      return errorResponse("User is not authorized");
    }

    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    const avatar = formData.get("avatar") as File;
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];

    if (!avatar || !avatar.name) {
      return errorResponse("Avatar is required");
    }

    const timestamp = new Date().getTime();
    const uploadedImageUrl = `battlers/${avatar.name}_${timestamp}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uploadedImageUrl, avatar, {
        cacheControl: "3600",
        upsert: false,
        contentType: avatar.type || "image/jpeg",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return errorResponse("Error while uploading avatar");
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
      return errorResponse("Error saving battler data");
    }

    const battlerId = battlerInsertData.id;

    if (tags.length > 0) {
      const tagData = tags.map((tagId) => ({
        battler_id: battlerId,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase.from(DB_TABLES.BATTLERS_TAGS).insert(tagData);

      if (tagsError) {
        console.error("Battler tag insertion error:", tagsError);
        return errorResponse("Error saving battler tags");
      }
    }

    return successResponse("Battler created successfully");
  } catch (error) {
    console.error("Unexpected error in createBattlersAction:", error);
    return errorResponse("An unexpected error occurred while creating battler.");
  }
};

export const editBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData?.user) {
    return errorResponse("User not authenticated");
  }

  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];
  const avatar = formData.get("avatar") as File;

  let avatarUrl: string | undefined;

  try {
    if (avatar && avatar.size > 0) {
      const timestamp = new Date().getTime();
      const uploadedImageUrl = `battlers/${avatar.name}_${timestamp}`;

      const { data: currentBattler } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("avatar")
        .eq("id", userId)
        .single();

      const { data: existingFile } = await supabase.storage.from(BUCKET_NAME).list("battlers", {
        search: avatar.name,
      });

      if (existingFile && existingFile.length > 0) {
        const existingPath = `battlers/${existingFile[0].name}`;
        const { data: existingUrl } = await supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(existingPath);
        avatarUrl = existingUrl.publicUrl;
      } else {
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(uploadedImageUrl, avatar, {
            cacheControl: "3600",
            upsert: false,
            contentType: avatar.type || "image/jpeg",
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return errorResponse("Error uploading new avatar");
        }

        const { data: publicUrlData } = await supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(uploadedImageUrl);
        avatarUrl = publicUrlData.publicUrl;

        if (currentBattler?.avatar) {
          const oldPath = currentBattler.avatar.split("/").pop();
          if (oldPath) {
            await supabase.storage.from(BUCKET_NAME).remove([`battlers/${oldPath}`]);
          }
        }
      }
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
      return errorResponse("Error updating battler");
    }

    // tags handle
    if (tags) {
      await supabase.from(DB_TABLES.BATTLERS_TAGS).delete().eq("battler_id", userId);

      const tagData = tags.map((tagId) => ({
        battler_id: userId,
        tag_id: tagId,
      }));

      if (tagData.length > 0) {
        const { error: tagInsertError } = await supabase
          .from(DB_TABLES.BATTLERS_TAGS)
          .insert(tagData);

        if (tagInsertError) {
          console.error("Tag update error:", tagInsertError);
          return errorResponse("Error updating battler tags");
        }
      }
    }

    return successResponse("Battler updated successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return errorResponse(errorMessage);
  }
};

export const deleteBattlersAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return errorResponse("userId is required");
  }

  const { error: tagError } = await supabase
    .from(DB_TABLES.BATTLERS_TAGS)
    .delete()
    .eq("battler_id", userId);

  if (tagError) {
    console.error("Failed to delete battler_tags:", tagError);
    return errorResponse("Failed to delete battler tags");
  }

  const { error } = await supabase.from(DB_TABLES.BATTLERS).delete().eq("id", userId);

  if (error) {
    console.error("Delete error:", error);
    return errorResponse("Failed to delete battler");
  }

  return successResponse("Battler deleted successfully");
};
