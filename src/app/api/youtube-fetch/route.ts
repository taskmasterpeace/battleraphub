import { Item, Video } from "@/types/youtube";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

// This route is protected by a cron secret, get youtube videos from AlgorithmInstituteofBR channel for home page videos with vercel cron job
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = "UCsbjTS5ELYvqXQ_SF2WCbqg";

    if (!apiKey) {
      return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 });
    }

    const queryParams = new URLSearchParams({
      order: "date",
      part: "snippet,id",
      maxResults: "6",
      channelId,
      key: apiKey,
    });

    const ytRes = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/search?${queryParams.toString()}`,
      { next: { revalidate: 60 * 60 * 24 } }, // Revalidate once per day
    );

    if (!ytRes.ok) {
      throw new Error(`YouTube API responded with status: ${ytRes.status}`);
    }

    const ytData = await ytRes.json();

    // Type guard to ensure the response has the expected structure
    if (!ytData.items || !Array.isArray(ytData.items)) {
      throw new Error("Invalid response from YouTube API");
    }

    const videos: Video[] = ytData.items
      .filter((item: Item) => item.id?.kind === "youtube#video" && item.id?.videoId)
      .map((item: Item, index: number) => ({
        order: index + 1,
        id: item.id.videoId,
        title: item.snippet?.title || "No title",
        thumbnail: item.snippet?.thumbnails?.high?.url || "",
        videoId: item.id.videoId,
      }));

    // Cache the videos in Vercel KV
    await kv.set("recent_algo_institute_videos", JSON.stringify(videos));

    return NextResponse.json({ message: "Videos updated successfully", videos });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 });
  }
}
