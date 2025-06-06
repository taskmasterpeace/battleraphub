"use server";

import { VideoStatistics } from "@/types/youtube";

// get youtube video by handle name
export const getVideosFromYoutubeHandle = async (handle: string) => {
  const apiKey = process.env.YOUTUBE_API_KEY || "";
  try {
    // Step 1: Get the YouTube channel ID from the handle
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${apiKey}`,
    );
    const searchData = await searchRes.json();
    // Return empty array if no channel found for the handle
    if (!searchData.items || searchData.items.length === 0) {
      console.warn(`No channel found for handle: ${handle}`);
      return [];
    }
    const channelId = searchData.items[0].snippet.channelId;
    // Step 2: Fetch top 6 most popular videos by view count
    const popularRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=viewCount&type=video&key=${apiKey}`,
    );
    const popularData = await popularRes.json();
    const popularVideos = (popularData.items || []).slice(0, 3); // Use top 3 popular videos
    // Step 3: Fetch top 6 latest videos by date
    const latestRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=6&order=date&type=video&key=${apiKey}`,
    );
    const latestData = await latestRes.json();
    let latestVideos = latestData.items || [];
    // Step 4: Remove duplicate videos that are already in the popular list
    const popularVideoIds = new Set(
      popularVideos.map((v: { id: { videoId: string } }) => v.id.videoId),
    );
    latestVideos = latestVideos
      .filter((v: { id: { videoId: string } }) => !popularVideoIds.has(v.id.videoId))
      .slice(0, 3); // Use top 3 after removing duplicates
    // Step 5: Combine popular and latest videos
    const taggedPopularVideos = popularVideos.map((v: { id: { videoId: string } }) => ({
      ...v,
      tag: "popular",
    }));
    const taggedLatestVideos = latestVideos.map((v: { id: { videoId: string } }) => ({
      ...v,
      tag: "latest",
    }));
    const allVideos = [...taggedPopularVideos, ...taggedLatestVideos];
    // Step 6: Fetch video statistics (views, likes)
    const videoIds = allVideos.map((v) => v.id.videoId).join(",");
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`,
    );
    const statsData = await statsRes.json();
    // Step 7: Map statistics to the corresponding videos
    const statsMap: Map<string, VideoStatistics> = new Map(
      statsData.items.map((item: { id: string; statistics: VideoStatistics }) => [
        item.id,
        item.statistics,
      ]),
    );
    // Step 8: Return structured video data with statistics
    return allVideos.map((item, index) => {
      const stats = statsMap.get(item.id.videoId);
      return {
        channelId,
        order: index + 1,
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        views: parseInt(stats?.viewCount || "0", 10),
        likes: parseInt(stats?.likeCount || "0", 10),
        tag: item.tag,
      };
    });
  } catch (err) {
    // Log and return empty array on error
    console.error(`YouTube API error for handle "${handle}":`, err);
    return [];
  }
};
