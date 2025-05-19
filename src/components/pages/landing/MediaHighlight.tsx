"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video } from "lucide-react";
import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import { User, YoutubeVideoType } from "@/types";
import TrendingVideoCard from "./TrendingVideoCard";
import FeaturedMediaCard from "./FeaturedMediaCard";
import { supabase } from "@/utils/supabase/client";

// Fetcher for featured media
async function fetchFeaturedMedia() {
  const { data: featureMedia } = await supabase
    .from(MATERIALIZED_VIEWS.RANDOM_MEDIA_USERS_VIEW)
    .select("*");

  const formattedData: Record<string, User[]> = {};

  if (featureMedia) {
    featureMedia.forEach((user) => {
      if (!formattedData[user.id]) {
        formattedData[user.id] = [user];
      }
    });
  }

  return formattedData;
}

async function fetchTrendingMedia() {
  const { data: popularVideos } = await supabase
    .from(DB_TABLES.MEDIA_CONTENT)
    .select("*")
    .order("likes", { ascending: false })
    .order("views", { ascending: false })
    .eq("tag", "popular")
    .eq("type", "youtube_video")
    .limit(3);

  const { data: latestVideos } = await supabase
    .from(DB_TABLES.MEDIA_CONTENT)
    .select("*")
    .order("created_at", { ascending: false })
    .eq("tag", "latest")
    .eq("type", "youtube_video")
    .limit(2);

  const combined = [...(popularVideos || []), ...(latestVideos || [])];
  const formattedData: Record<string, YoutubeVideoType[]> = {};

  combined.forEach((video) => {
    if (video.user_id) {
      if (!formattedData[video.user_id]) {
        formattedData[video.user_id] = [];
      }
      formattedData[video.user_id].push(video);
    }
  });

  return formattedData;
}

export default function MediaHighlight() {
  const { data: usersData, isLoading: usersLoading } = useSWR("featuredMedia", fetchFeaturedMedia);
  const { data: trendingVideoData, isLoading: trendingLoading } = useSWR(
    "trendingMedia",
    fetchTrendingMedia,
  );

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

        {/* Featured Media Tab */}
        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usersLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i + "featured_loading"} className="bg-muted animate-pulse">
                      <CardContent className="p-0 bg-muted h-80" />
                    </Card>
                  ))
              : Object.entries(usersData || {}).map(([, userArray]) =>
                  userArray.map((user: User) => (
                    <FeaturedMediaCard user={user} key={user.id + "featured"} />
                  )),
                )}
          </div>
        </TabsContent>

        {/* Trending Content Tab */}
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
                      <div
                        key={i + "trending_loading"}
                        className="h-20 bg-muted animate-pulse rounded-md"
                      ></div>
                    ))
                ) : !trendingVideoData || Object.keys(trendingVideoData).length === 0 ? (
                  <div className="text-center py-8 text-foreground">No Data Found</div>
                ) : (
                  Object.entries(trendingVideoData).flatMap(([userId, videos]) =>
                    videos.map((content, idx) => (
                      <TrendingVideoCard
                        key={userId + "trending" + idx}
                        idx={idx}
                        userId={userId}
                        content={content}
                      />
                    )),
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
