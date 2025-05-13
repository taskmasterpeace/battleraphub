"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp, MessageSquare, Eye, Calendar } from "lucide-react";
import { Video } from "@/types/youtube";
import { getLatestVideosFromYoutubeChannel } from "@/lib/youtube-service";

interface YouTubeVideoSectionProps {
  youtubeHandleUrl: string;
}

export default function YouTubeVideoSection({ youtubeHandleUrl }: YouTubeVideoSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const data = await getLatestVideosFromYoutubeChannel(youtubeHandleUrl);
        setVideos(data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [youtubeHandleUrl]);

  if (!youtubeHandleUrl || youtubeHandleUrl.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No YouTube channels have been added yet.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatCount = (count: number | undefined) => {
    if (!count) return "0";
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No videos found for this channel.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video?.id} className="overflow-hidden hover:border-amber-500 transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={video?.thumbnail || "/placeholder.svg"}
                      alt={video?.title || "Video thumbnail"}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-destructive-foreground text-destructive border-destructive">
                      YouTube
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video?.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {video?.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(video?.publishedAt || "")}
                      </div>

                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatCount(video?.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {formatCount(video?.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {formatCount(video?.comments)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a
                          href={`https://youtube.com/watch?v=${video?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Watch on YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
