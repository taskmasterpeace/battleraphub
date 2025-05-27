import { extractYouTubeHandle, jsonResponse } from "@/lib/utils";
import { getVideosFromYoutubeHandle } from "@/lib/youtube-service";
import { NextResponse } from "next/server";
import { protectedCreateClient } from "@/utils/supabase/protected-server";
import { DB_TABLES, ROLE } from "@/config";

// This route is protected by a cron secret, get youtube videos channel name with vercel cron job which is run on every days (vercel.json)
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const supabase = await protectedCreateClient();
  try {
    // Fetch users with role_id 3 and a non-empty YouTube URL
    const { data: userData, error: userError } = await supabase
      .from(DB_TABLES.USERS)
      .select("id, youtube")
      .eq("role_id", ROLE.MEDIA)
      .not("youtube", "is", null)
      .neq("youtube", "");
    // Return error if there's an issue fetching user data
    if (userError) {
      return jsonResponse(
        {
          status: 500,
          success: false,
          error: userError.message,
          message: "Failed to fetch user data",
        },
        500,
      );
    }
    // Iterate over the fetched users
    for (const user of userData) {
      const handle = extractYouTubeHandle(user.youtube);
      // Skip user if YouTube handle extraction fails
      if (!handle) {
        console.warn(`Invalid YouTube URL: ${user.youtube}`);
        continue;
      }
      // Check for existing YouTube videos linked to the user
      const { data: existingVideos, error: existingError } = await supabase
        .from(DB_TABLES.MEDIA_CONTENT)
        .select("id")
        .eq("user_id", user.id)
        .eq("type", "youtube_video");
      // Log and continue if error fetching existing videos
      if (existingError) {
        console.error(`Error checking existing videos for user ${user.id}:`, existingError.message);
        continue;
      }
      const existingCount = existingVideos?.length || 0;
      // Skip user if they already have 5 or more YouTube videos
      if (existingCount >= 6) {
        console.log(`User ${handle} ${user.id} already has ${existingCount} videos. Skipping.`);
        continue;
      }
      // Fetch the latest videos from YouTube for the user
      const videos = await getVideosFromYoutubeHandle(handle);
      const videosToInsert = videos.slice(0, 6 - existingCount);
      // Insert the fetched videos into the database
      for (const video of videosToInsert) {
        const existingLink = `https://www.youtube.com/watch?v=${video.videoId}`;

        // Check if this video already exists
        const { data: existing, error: existingCheckError } = await supabase
          .from(DB_TABLES.MEDIA_CONTENT)
          .select("id")
          .eq("user_id", user.id)
          .eq("link", existingLink)
          .single();

        if (existingCheckError && existingCheckError.code !== "PGRST116") {
          console.error(
            `Error checking for existing video ${existingLink}:`,
            existingCheckError.message,
          );
          continue;
        }

        // Upsert video
        const { error: upsertError } = await supabase
          .from(DB_TABLES.MEDIA_CONTENT)
          .upsert({
            id: existing?.id,
            user_id: user.id,
            type: "youtube_video",
            date: video.publishedAt,
            title: video.title,
            description: video.description,
            thumbnail_img: video.thumbnail,
            link: existingLink,
            views: video.views,
            likes: video.likes,
            tag: video.tag,
          })
          .match({ id: existing?.id });

        if (upsertError) {
          console.error(`Error upserting video for user ${user.id}:`, upsertError.message);
        }
      }
    }

    return jsonResponse(
      {
        status: 200,
        success: true,
        message: "YouTube videos fetched successfully",
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 });
  }
}
