"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { protectedCreateClient } from "@/utils/supabase/protected-server";
import { DB_TABLES, PAGES, PERMISSIONS, ROLES_NAME, RPC_FUNCTIONS } from "@/config";
import {
  successResponse,
  errorResponse,
  redirectResponse,
  encodedRedirect,
} from "@/utils/response";
import { uploadFileToStorage } from "@/lib/uploadFileToStorage";
import { Battlers, MediaContent, MyRating, User, UserBadge } from "@/types";

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

  return redirectResponse(PAGES.HOME);
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
    if (!userData?.user) return errorResponse("User is not authorized");

    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    const avatar = formData.get("avatar") as File;
    const banner = formData.get("banner") as File;
    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];

    if (!avatar?.name) return errorResponse("Avatar is required");
    if (!banner?.name) return errorResponse("Banner is required");

    const avatarUpload = await uploadFileToStorage(supabase, avatar, "battlers/profile");
    if (avatarUpload.error) return errorResponse(avatarUpload.error);

    const bannerUpload = await uploadFileToStorage(supabase, banner, "battlers/banner");
    if (bannerUpload.error) return errorResponse(bannerUpload.error);

    const { data: battlerInsertData, error: insertError } = await supabase
      .from(DB_TABLES.BATTLERS)
      .insert({
        name,
        location,
        bio,
        avatar: avatarUpload.publicUrl,
        banner: bannerUpload.publicUrl,
        added_by: userData.user.id,
      })
      .select("id")
      .single();

    if (insertError || !battlerInsertData?.id) {
      console.error("Insert error:", insertError);
      return errorResponse("Error saving battler data");
    }

    if (tags.length > 0) {
      const tagData = tags.map((tagId) => ({
        battler_id: battlerInsertData.id,
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
  if (!userData?.user) return errorResponse("User not authenticated");

  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];
  const avatar = formData.get("avatar") as File;
  const banner = formData.get("banner") as File;

  try {
    // Fetch current battler to get current image URLs
    const { data: currentBattler } = await supabase
      .from(DB_TABLES.BATTLERS)
      .select("avatar, banner")
      .eq("id", userId)
      .single();

    let avatarUrl = currentBattler?.avatar;
    let bannerUrl = currentBattler?.banner;

    // Upload avatar if provided
    if (avatar && avatar.size > 0) {
      const avatarUpload = await uploadFileToStorage(
        supabase,
        avatar,
        "battlers/profile",
        currentBattler?.avatar,
      );
      if (avatarUpload.error) return errorResponse(avatarUpload.error);
      avatarUrl = avatarUpload.publicUrl;
    }

    // Upload banner if provided
    if (banner && banner.size > 0) {
      const bannerUpload = await uploadFileToStorage(
        supabase,
        banner,
        "battlers/banner",
        currentBattler?.banner,
      );
      if (bannerUpload.error) return errorResponse(bannerUpload.error);
      bannerUrl = bannerUpload.publicUrl;
    }

    // Update battler
    const { error: updateError } = await supabase
      .from(DB_TABLES.BATTLERS)
      .update({
        name,
        location,
        bio,
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(bannerUrl && { banner: bannerUrl }),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      return errorResponse("Error updating battler");
    }

    // Update tags
    await supabase.from(DB_TABLES.BATTLERS_TAGS).delete().eq("battler_id", userId);

    if (tags.length > 0) {
      const tagData = tags.map((tagId) => ({
        battler_id: userId,
        tag_id: tagId,
      }));

      const { error: tagInsertError } = await supabase
        .from(DB_TABLES.BATTLERS_TAGS)
        .insert(tagData);

      if (tagInsertError) {
        console.error("Tag update error:", tagInsertError);
        return errorResponse("Error updating battler tags");
      }
    }

    return successResponse("Battler updated successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return errorResponse(errorMessage);
  }
};

export const deleteBattlersAction = async (battlerId: string) => {
  const supabase = await protectedCreateClient();
  if (!battlerId) {
    return errorResponse("battlerId is required");
  }

  const { error: tagError } = await supabase
    .from(DB_TABLES.BATTLERS_TAGS)
    .delete()
    .eq("battler_id", battlerId);

  if (tagError) {
    console.error("Failed to delete battler_tags:", tagError);
    return errorResponse("Failed to delete battler tags");
  }

  const { error: badgeError } = await supabase
    .from(DB_TABLES.BATTLER_BADGES)
    .delete()
    .eq("battler_id", battlerId);

  if (badgeError) {
    console.error("Failed to delete battler_badges:", badgeError);
    return errorResponse("Failed to delete battler badges");
  }

  const { error: ratingError } = await supabase
    .from(DB_TABLES.BATTLER_RATINGS)
    .delete()
    .eq("battler_id", battlerId);

  if (ratingError) {
    console.error("Failed to delete battler_ratings:", ratingError);
    return errorResponse("Failed to delete battler ratings");
  }

  const { error: analyticsError } = await supabase
    .from(DB_TABLES.BATTLER_ANALYTICS)
    .delete()
    .eq("battler_id", battlerId);

  if (analyticsError) {
    console.error("Failed to delete battler_analytics:", analyticsError);
    return errorResponse("Failed to delete battler analytics");
  }

  const { data: weightedBattlerData } = await supabase
    .from(DB_TABLES.WEIGHTED_BATTLER_ANALYTICS)
    .select()
    .eq("battler_id", battlerId);

  if (weightedBattlerData && weightedBattlerData.length > 0) {
    const { error: weightedBattlerError } = await supabase
      .from(DB_TABLES.WEIGHTED_BATTLER_ANALYTICS)
      .delete()
      .eq("battler_id", battlerId);

    if (weightedBattlerError) {
      console.error("Failed to delete weighted battler:", weightedBattlerError);
      return errorResponse("Failed to delete weighted battler");
    }
  }

  const { error } = await supabase.from(DB_TABLES.BATTLERS).delete().eq("id", battlerId);

  if (error) {
    console.error("Delete error:", error);
    return errorResponse("Failed to delete battler");
  }

  return successResponse("Battler deleted successfully");
};

export const ratingRoleWeightsActions = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  try {
    const weightsString = formData.get("roleWeights") as string;
    const roleWeights = JSON.parse(weightsString);

    const entries = Object.entries(roleWeights).map(([role, weight]) => ({
      role_id: role,
      weight: Number(weight),
    }));

    const { error } = await supabase
      .from(DB_TABLES.RATING_ROLE_WEIGHTS)
      .upsert(entries, { onConflict: "role_id" });

    if (error) {
      console.error("Upsert ratingRoleWeight error:", error);
      return errorResponse("Failed to update rating role weights.");
    }

    return successResponse("Rating role weights updated successfully");
  } catch (error) {
    console.error("Unexpected error in ratingRoleWeightsActions:", error);
    return errorResponse("An unexpected error occurred while updating weights.");
  }
};

// Analytics role based on battler rating
export const topBattlerByRatingAction = async (
  selectedRole: number,
  selectedCategory: string,
  selectedAttribute: number | string,
) => {
  const supabase = await protectedCreateClient();
  const { data: topBattler, error: rpcError } = await supabase.rpc(
    RPC_FUNCTIONS.GET_TOP_BATTLERS_BY_RATING,
    {
      p_role_id: selectedRole,
      p_category: selectedCategory.toLowerCase(),
      p_attribute_id: selectedAttribute === "All" ? null : Number(selectedAttribute),
    },
  );

  if (rpcError) {
    console.error("Error fetching top battlers:", rpcError);
    return errorResponse("Failed to fetch top battlers");
  }

  return topBattler;
};

export const updateUserProfileAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();

  const name = formData.get("name") as string;
  const userId = formData.get("userId") as string;
  const avatar = formData.get("avatar") as File;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as File;
  const website = formData.get("website") as string;
  const location = formData.get("location") as string;
  const twitter = formData.get("twitter") as string;
  const instagram = formData.get("instagram") as string;
  const youtube = formData.get("youtube") as string;

  try {
    // Fetch current battler to get current image URLs
    const { data: currentUser, error: fetchError } = await supabase
      .from(DB_TABLES.USERS)
      .select("avatar, image")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return errorResponse("Failed to fetch user data");
    }

    let avatarUrl = currentUser?.avatar;
    let imageUrl = currentUser?.image;

    if (avatar && avatar.size > 0) {
      const avatarUpload = await uploadFileToStorage(
        supabase,
        avatar,
        "users/avatars",
        currentUser?.avatar,
      );

      if (avatarUpload.error) return errorResponse(avatarUpload.error);
      avatarUrl = avatarUpload.publicUrl;
    }

    if (image && image.size > 0) {
      const imageUpload = await uploadFileToStorage(
        supabase,
        image,
        "users/banners",
        currentUser?.image,
      );

      if (imageUpload.error) return errorResponse(imageUpload.error);
      imageUrl = imageUpload.publicUrl;
    }

    const { error: updateError } = await supabase
      .from(DB_TABLES.USERS)
      .update({
        ...(name && { name }),
        ...(bio && { bio }),
        ...(location && { location }),
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(imageUrl && { image: imageUrl }),
        ...(website !== undefined && { website }),
        ...(twitter !== undefined && { twitter }),
        ...(instagram !== undefined && { instagram }),
        ...(youtube !== undefined && { youtube }),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return errorResponse("Failed to update user profile");
    }

    return successResponse("User profile updated successfully");
  } catch (error) {
    console.error("Unexpected error in updateUserProfile:", error);
    return errorResponse("An unexpected error occurred while updating profile");
  }
};

export async function getUserByUsername(username: string): Promise<User | null> {
  // In a real app, this would query your database
  const supabase = await protectedCreateClient();
  const { data: userProfiles, error: userError } = await supabase
    .from(DB_TABLES.USERS)
    .select(
      `
      *,
      user_permissions!user_id (
        permission
      )
    `,
    )
    .eq("id", username);
  // .eq("name", username);

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  if (!userProfiles || userProfiles.length === 0) {
    return null;
  }

  const user = userProfiles[0];
  return user;
}

export async function getUserRatings(userId: string): Promise<MyRating[]> {
  const supabase = await protectedCreateClient();
  const { data } = await supabase.rpc(RPC_FUNCTIONS.ALL_MY_RATINGS_BATTLERS, {
    p_user_id: userId,
  });

  if (!data) {
    throw new Error("Failed to fetch user profiles");
  }

  return data.sort(
    (a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const supabase = await protectedCreateClient();

  const { data: userBadges, error: userBadgesError } = await supabase
    .from(DB_TABLES.BATTLER_BADGES)
    .select(
      `
      id,
      user_id,
      battler_id,
      badge_id,
      badges (
        id,
        name,
        description,
        is_positive,
        category
      )
    `,
    )
    .eq("user_id", userId);

  if (userBadgesError) {
    console.error("Error fetching user badges:", userBadgesError);
    return [];
  }

  return userBadges.map((badge) => ({
    ...badge,
    badges: Array.isArray(badge.badges) ? badge.badges[0] : badge.badges,
  }));
}

export const getUserContentAction = async (userId: string): Promise<MediaContent[]> => {
  const supabase = await protectedCreateClient();
  const { data: mediaContent, error } = await supabase
    .from(DB_TABLES.MEDIA_CONTENT)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media content:", error);
    return [];
  }
  return mediaContent || [];
};

export const addUserContentAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData?.user) return errorResponse("User is not authorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const type = formData.get("type") as string;
    const thumbnail_img = formData.get("thumbnail_img") as File;
    const userId = formData.get("userId") as string;
    const date = formData.get("date") as string;

    if (!thumbnail_img?.name) return errorResponse("Thumbnail is required");

    const thumbnailUpload = await uploadFileToStorage(
      supabase,
      thumbnail_img,
      "users/media-content",
    );

    if (thumbnailUpload.error) return errorResponse(thumbnailUpload.error);

    const { data: mediaContentData, error: insertError } = await supabase
      .from(DB_TABLES.MEDIA_CONTENT)
      .insert({
        title,
        description,
        link,
        type,
        thumbnail_img: thumbnailUpload.publicUrl,
        user_id: userId,
        date,
      })
      .select("*");

    if (insertError || !mediaContentData) {
      console.error("Insert error:", insertError);
      return errorResponse("Error while saving media content");
    }

    return successResponse("Media content saved successfully");
  } catch (error) {
    console.error("Unexpected error in Add Media Content:", error);
    return errorResponse("An unexpected error occurred while creating media content.");
  }
};

export const editMediaContentAction = async (formData: FormData) => {
  const supabase = await protectedCreateClient();
  const supabaseClient = await createClient();

  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData?.user) return errorResponse("User not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;
  const thumbnail_img = formData.get("thumbnail_img") as File;
  const date = formData.get("date") as string;
  const contentId = formData.get("contentId") as string;

  try {
    // Fetch current Content to get current image URLs
    const { data: currentContent } = await supabase
      .from(DB_TABLES.MEDIA_CONTENT)
      .select("thumbnail_img")
      .eq("id", contentId)
      .single();

    let thumbnailUrl = currentContent?.thumbnail_img;

    // Upload thumbnail if provided
    if (thumbnail_img && thumbnail_img.size > 0) {
      const thumbnailUpload = await uploadFileToStorage(
        supabase,
        thumbnail_img,
        "users/media-content",
        currentContent?.thumbnail_img,
      );
      if (thumbnailUpload.error) return errorResponse(thumbnailUpload.error);
      thumbnailUrl = thumbnailUpload.publicUrl;
    }

    // Update content
    const { error: updateError } = await supabase
      .from(DB_TABLES.MEDIA_CONTENT)
      .update({
        title,
        description,
        link,
        type,
        ...(thumbnailUrl && { thumbnail_img: thumbnailUrl }),
        ...(date && { date }),
      })
      .eq("id", contentId);

    if (updateError) {
      console.error("Update error:", updateError);
      return errorResponse("Error updating media content");
    }

    return successResponse("Media content updated successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return errorResponse(errorMessage);
  }
};

export const deleteContentAction = async (contentId: string) => {
  const supabase = await protectedCreateClient();
  try {
    const { error: deleteError } = await supabase
      .from(DB_TABLES.MEDIA_CONTENT)
      .delete()
      .eq("id", contentId);
    if (deleteError) {
      console.error("Error deleting content:", deleteError);
      return errorResponse("Error deleting content");
    }
    return successResponse("Content deleted successfully");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return errorResponse(errorMessage);
  }
};
export const highlightedBattlerAction = async (isChecked: boolean, battler: Battlers) => {
  const supabase = await protectedCreateClient();
  const userId = battler?.added_by;
  try {
    if (isChecked) {
      const { data: userData } = await supabase
        .from(DB_TABLES.USERS)
        .select("*")
        .eq("id", userId)
        .single();

      if (!userData) {
        throw new Error("User not found");
      }
      const { error: highLightError } = await supabase
        .from(DB_TABLES.HIGHLIGHTS)
        .insert({
          entity_id: battler.id,
          entity_type: ROLES_NAME[userData.role_id],
        })
        .select();

      if (highLightError) {
        console.error("Error adding highlight:", highLightError);
        return errorResponse("Error adding highlight");
      }
      return successResponse("Highlighted battler added successfully");
    } else {
      const { error: highLightError } = await supabase
        .from(DB_TABLES.HIGHLIGHTS)
        .delete()
        .eq("entity_id", battler.id);

      if (highLightError) {
        console.error("Error removing highlight:", highLightError);
        return errorResponse("Error removing highlight");
      }
      return successResponse("Highlighted battler removed successfully");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Something went wrong";
    return errorResponse(errorMessage);
  }
};
