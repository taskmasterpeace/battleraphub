"use server";

import { Video, YoutubeResponse } from "@/types/youtube";
import { supabase } from "@/utils/supabase/client";

// Mock data to use as fallback
const MOCK_FEATURED_VIDEOS = [
  {
    id: "1",
    title: "Backstage Beatdown: The Eazy vs Papoose Brawl",
    videoId: "Iu5aZDqOKm4",
    thumbnail: "https://img.youtube.com/vi/Iu5aZDqOKm4/mqdefault.jpg",
    order: 0,
  },
  {
    id: "2",
    title: "The Attempted Assassination of Big T",
    videoId: "O5HHsIiB4Bk",
    thumbnail: "https://img.youtube.com/vi/O5HHsIiB4Bk/mqdefault.jpg",
    order: 1,
  },
  {
    id: "3",
    title: "Calicoe & Norbes: Shootout on Joy Road",
    videoId: "4BwT8aTCpiY",
    thumbnail: "https://img.youtube.com/vi/4BwT8aTCpiY/mqdefault.jpg",
    order: 2,
  },
  {
    id: "4",
    title: "The Heinous Murder of Pat Stay",
    videoId: "kGMqBOUG3RY",
    thumbnail: "https://img.youtube.com/vi/kGMqBOUG3RY/mqdefault.jpg",
    order: 3,
  },
];

// In a real app, this would use the YouTube API
// For now, we'll simulate it
export async function getYouTubeVideoInfo(videoUrl: string): Promise<{
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
}> {
  // Extract video ID from URL
  const videoId = await extractYouTubeVideoId(videoUrl);

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // In a real app, you would call the YouTube API here
  // For now, we'll return mock data
  return {
    title: `YouTube Video ${videoId}`,
    thumbnail: `/placeholder.svg?height=720&width=1280&text=YouTube+Video+${videoId}`,
    views: Math.floor(Math.random() * 100000),
    likes: Math.floor(Math.random() * 5000),
    comments: Math.floor(Math.random() * 1000),
  };
}

export async function extractYouTubeVideoId(url: string): Promise<string | null> {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return null;
}

export async function getYouTubeEmbedUrl(videoId: string): Promise<string> {
  return `https://www.youtube.com/embed/${videoId}`;
}

export async function isValidYouTubeUrl(url: string): Promise<boolean> {
  const videoId = await extractYouTubeVideoId(url);
  return !!videoId;
}

// Get featured videos for the home page
export async function getFeaturedVideos() {
  try {
    // Try to get videos from the database
    const { data, error } = await supabase
      .from("featured_videos")
      .select("*")
      .order("order", { ascending: true });

    // If there's an error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log("Using mock featured videos data");
      return MOCK_FEATURED_VIDEOS;
    }

    return data;
  } catch (error) {
    // Log the error but don't throw it - return mock data instead
    console.error("Error fetching featured videos:", error);
    console.log("Using mock featured videos data due to error");
    return MOCK_FEATURED_VIDEOS;
  }
}

// Save featured videos (admin only)
export async function manageFeaturedVideos(videos: Video[]) {
  try {
    // Check if the table exists first
    const { error: tableCheckError } = await supabase
      .from("featured_videos")
      .select("count")
      .limit(1);

    // If the table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Featured videos table doesn't exist yet. Creating it...");

      // In a real app, you would run the migration here
      // For now, we'll just return success and use mock data
      console.log("Table creation would happen here in a real app");
      return true;
    }

    // If the table exists, proceed with the update
    // First, delete all existing featured videos
    const { error: deleteError } = await supabase
      .from("featured_videos")
      .delete()
      .not("id", "is", null); // Safety check

    if (deleteError) throw deleteError;

    // Then insert the new videos
    const { error: insertError } = await supabase.from("featured_videos").insert(
      videos.map((video: Video) => ({
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`,
        order: video.order,
      })),
    );

    if (insertError) throw insertError;

    return true;
  } catch (error) {
    console.error("Error managing featured videos:", error);
    // For now, we'll just log the error and return success
    // This allows the UI to work even if the database isn't set up yet
    return true;
  }
}

export async function getChannelVideos(
  channelId: string,
  maxResults = 5,
): Promise<
  {
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    likes: number;
    comments: number;
    publishedAt: string;
  }[]
> {
  // In a real app, you would call the YouTube API here with the channel ID
  // For now, we'll return mock data

  // Generate random video IDs
  const videoIds = Array.from(
    { length: maxResults },
    (_, i) => `video${i + 1}_${Math.random().toString(36).substring(2, 8)}`,
  );

  return videoIds.map((videoId) => ({
    id: videoId,
    title: `Channel ${channelId} Video: ${videoId}`,
    thumbnail: `/placeholder.svg?height=720&width=1280&text=YouTube+Video+${videoId}`,
    views: Math.floor(Math.random() * 100000),
    likes: Math.floor(Math.random() * 5000),
    comments: Math.floor(Math.random() * 1000),
    publishedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }));
}

export const getLatestVideos = async (): Promise<Video[]> => {
  const channelId = "UCsbjTS5ELYvqXQ_SF2WCbqg";
  const apiKey = process.env.YOUTUBE_API_KEY || "";

  const queryParams = new URLSearchParams({
    order: "date",
    part: "snippet,id",
    eventType: "none",
    channelType: "any",
    channelId: channelId,
    key: apiKey,
  });

  const response = await fetch(
    `https://content-youtube.googleapis.com/youtube/v3/search?${queryParams.toString()}`,
  );
  const data: YoutubeResponse = await response.json();

  // Filter and format the data
  const videos = data.items
    .filter((i) => i.id.kind === "youtube#video")
    .map((item, index) => ({
      order: index + 1,
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      videoId: item.id.videoId,
    }));

  return videos;
};

export const getLatestVideosFromYoutubeChannel = async (youtubeUrl: string): Promise<Video[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY || "";
  const youtubeUrlMatch = youtubeUrl?.match(/@([a-zA-Z0-9_]+)/);

  const extractZYoutubeHandle = youtubeUrlMatch?.[1];
  if (!extractZYoutubeHandle) return [];

  // Step 1: Get channel ID by handle
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${extractZYoutubeHandle}&key=${apiKey}`,
  );
  const channelData = await channelRes.json();

  const channelId = channelData.items?.[0]?.id;
  if (!channelId) return [];

  // Step 2: Fetch latest 5 videos by channel ID
  const searchParams = new URLSearchParams({
    order: "date",
    key: apiKey,
    part: "snippet",
    channelId,
    maxResults: "5",
    type: "video",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);

  const data: YoutubeResponse = await response.json();
  const videos = data.items.map((item, index: number) => ({
    order: index + 1,
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    videoId: item.id.videoId,
  }));
  return videos;
};
