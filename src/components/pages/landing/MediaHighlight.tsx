"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video } from "lucide-react";
import { ROLE } from "@/config";
import {
  getLatestVideosFromYoutubeChannel,
  getMixedVideosFromYoutubeChannel,
} from "@/lib/youtube-service";
import { Video as VideoType } from "@/types/youtube";
import { User } from "@/types";
import TrendingVideoCard from "./TrendingVideoCard";
import FeaturedMediaCard from "./FeaturedMediaCard";

interface MediaHighlightProps {
  usersData: User[];
}
export default function MediaHighlight({ usersData }: MediaHighlightProps) {
  const [videoData, setVideoData] = useState<Record<string, VideoType[]>>({});
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [trendingVideoData, setTrendingVideoData] = useState<Record<string, VideoType[]>>({});
  const [trendingLoading, setTrendingLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async (
      fetchFunction: (channelId: string) => Promise<VideoType[]>,
      setData: React.Dispatch<React.SetStateAction<Record<string, VideoType[]>>>,
      setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      if (setLoading) setLoading(true);
      try {
        const mediaUsers = usersData?.filter((item) => item?.role_id === ROLE.MEDIA) || [];
        const videoPromises = mediaUsers.map(async (user) => {
          if (!user.youtube) return null;
          const videos = await fetchFunction(user.youtube);
          return { userId: user.id, videos };
        });

        const results = await Promise.all(videoPromises);
        const dataMap: Record<string, VideoType[]> = {};

        results.forEach((result) => {
          if (result) {
            dataMap[result.userId] = result.videos;
          }
        });

        setData(dataMap);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        if (setLoading) setLoading(false);
      }
    };

    fetchVideos(getMixedVideosFromYoutubeChannel, setTrendingVideoData, setTrendingLoading);
    fetchVideos(getLatestVideosFromYoutubeChannel, setVideoData, setUsersLoading);
  }, [usersData]);

  return (
    <div>
      <div className="flex items-center mb-4">
        <Video className="w-5 h-5 mr-2 text-primary" />
        <h2 className="text-2xl font-bold">Media Spotlight</h2>
      </div>

      <Tabs defaultValue="featured">
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Featured Media</TabsTrigger>
          <TabsTrigger value="trending">Trending Content</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usersLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="bg-muted animate-pulse">
                      <CardContent className="p-0 bg-muted h-80"></CardContent>
                    </Card>
                  ))
              : usersData
                  ?.filter((item) => item?.role_id === ROLE.MEDIA)
                  ?.slice(0, 3)
                  ?.map((user) => {
                    const videos = videoData[user.id] || [];
                    return <FeaturedMediaCard user={user} videos={videos} key={user.id} />;
                  })}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Trending Media Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-md"></div>
                    ))
                ) : Object.keys(trendingVideoData).length === 0 ? (
                  <div className="text-center py-8 text-foreground">No Data Found</div>
                ) : (
                  Object.entries(trendingVideoData).flatMap(([userId, videos]) =>
                    videos.map((content, idx) => {
                      return (
                        <TrendingVideoCard key={idx} idx={idx} userId={userId} content={content} />
                      );
                    }),
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
