import { YoutubeTranscript } from "youtube-transcript";

interface Tweet {
  text: string;
  edit_history_tweet_ids: string[];
  id: string;
  note_tweet?: {
    text: string;
    entities: {
      mentions: {
        start: number;
        end: number;
        username: string;
        id: string;
      }[];
    };
  };
}

type SearchResult = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
};

type VideoStats = {
  kind: string;
  etag: string;
  id: string;
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
};

/**
 * getUserTweetsByUserName
 * @param {string} username
 * @returns {Promise<Array<Tweet>>}
 */
export const getUserTweetsByUserName = async (username: string): Promise<Tweet[]> => {
  try {
    const bearerToken = process.env.X_API_KEY;
    if (!bearerToken) {
      throw new Error("Missing Twitter API bearer token.");
    }

    // Step 1: Get user ID from username
    const userRes = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user: ${userRes.statusText}`);
    }

    const userData = await userRes.json();
    const userId = userData?.data?.id;

    console.log("Fetched user ID of", username);
    if (!userId) {
      return [];
    }

    // Step 2: Get tweets using user ID
    const tweetRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=note_tweet,text&max_results=20`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      },
    );

    if (!tweetRes.ok) {
      throw new Error(`Failed to fetch tweets: ${tweetRes.statusText}`);
    }

    const tweetData = await tweetRes.json();
    console.log("Fetched tweets of", username);
    return tweetData?.data || [];
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
};

/**
 *
 * @param {string} videoId
 * @returns {Promise<string>}
 */
export const getVideoTranscript = async (videoId: string): Promise<string> => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const combinedText = transcript.map((item) => item.text).join(" ");
    return combinedText;
  } catch (error) {
    console.error(`Error fetching transcript for video ${videoId}:`, error);
    return "";
  }
};

/**
 *
 * @param {string} topic
 * @param {string} apiKey
 * @returns {Promise<Array<Video>>}
 */
export async function getVideoFromYoutubeTopic(topic: string, apiKey: string) {
  try {
    // Step 1: Search for videos related to the topic
    const searchParams = new URLSearchParams({
      part: "snippet",
      type: "video",
      eventType: "completed",
      q: topic,
      relevanceLanguage: "en",
      videoCaption: "any",
      key: apiKey,
      maxResults: "5",
    });

    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);
    if (!searchRes.ok) throw new Error("Search API call failed.");

    const searchDataJson = await searchRes.json();
    const searchData = searchDataJson.items as SearchResult[];

    if (!searchData || searchData.length === 0) {
      console.warn(`No videos found for topic: ${topic}`);
      return [];
    }

    // Step 2: Get video statistics
    const videoIds = searchData.map((v) => v.id.videoId).join(",");
    const statsParams = new URLSearchParams({
      part: "statistics",
      id: videoIds,
      key: apiKey,
    });

    const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?${statsParams}`);
    if (!statsRes.ok) throw new Error("Video stats API call failed.");

    const statsDataJson = await statsRes.json();
    const statsData = statsDataJson.items as VideoStats[];

    const statsMap = new Map(statsData.map((item) => [item.id, item.statistics]));

    // Combine search results with their statistics
    const videos = searchData.map((item) => ({
      ...item,
      statistics: statsMap.get(item.id.videoId) || {},
    }));

    return videos;
  } catch (error) {
    console.error(`YouTube API error for topic "${topic}":`, error);
    return [];
  }
}
