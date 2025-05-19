"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ThumbsUp, Eye, Calendar } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import useSWR from "swr";
import { YoutubeVideoType } from "@/types";

export default function YouTubeVideoSection() {
  const { data: videos = [], isLoading } = useSWR<YoutubeVideoType[]>(
    `${DB_TABLES.MEDIA_CONTENT}?type=youtube_video&tag=latest&limit=3`,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.MEDIA_CONTENT)
        .select("*")
        .eq("type", "youtube_video")
        .eq("tag", "latest")
        .limit(3);

      if (error) {
        throw error;
      }

      return data || [];
    },
  );

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
                      src={video?.thumbnail_img || "/placeholder.svg"}
                      alt={video?.title || "Video thumbnail"}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-destructive-foreground text-destructive border-destructive">
                      {video?.tag}
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
                        {formatDate(video?.date || "")}
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
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={video?.link || "#"} target="_blank" rel="noopener noreferrer">
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
