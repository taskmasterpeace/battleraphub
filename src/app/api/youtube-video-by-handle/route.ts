import { extractYouTubeHandle, jsonResponse } from "@/lib/utils";
import { getVideosFromYoutubeHandle } from "@/lib/youtube-service";
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
      console.error("Error fetching user data:", userError);
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
    // Inside the GET function, replace the for loop with this:
    for (const user of userData) {
      const handle = extractYouTubeHandle(user.youtube);
      if (!handle) {
        console.error("Invalid YouTube URL for user:", user.id);
        continue;
      }

      // Step 1: Get the latest 6 videos from YouTube
      const videos = await getVideosFromYoutubeHandle(handle);
      const latestVideos = videos.slice(0, 6); // Get first 6 videos

      // Step 2: Delete all previous videos for this user
      const { error: deleteError } = await supabase
        .from(DB_TABLES.MEDIA_CONTENT)
        .delete()
        .eq("user_id", user.id)
        .eq("type", "youtube_video");

      if (deleteError) {
        console.error("Error deleting old videos:", deleteError);
        continue;
      }

      // Step 3: Insert the new videos
      for (const video of latestVideos) {
        const videoLink = `https://www.youtube.com/watch?v=${video.videoId}`;

        const { error: insertError } = await supabase.from(DB_TABLES.MEDIA_CONTENT).insert({
          user_id: user.id,
          type: "youtube_video",
          date: video.publishedAt,
          title: video.title,
          description: video.description,
          thumbnail_img: video.thumbnail,
          link: videoLink,
          views: video.views,
          likes: video.likes,
          tag: video.tag,
        });

        if (insertError) {
          console.error("Error inserting new videos:", insertError);
          continue;
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
    return jsonResponse(
      {
        status: 500,
        success: false,
        error: error as string,
        message: "Failed to fetch YouTube videos",
      },
      500,
    );
  }
}
