import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { ExternalLink, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Youtube from "../../../../public/image/youtube.svg";
import PlatformX from "../../../../public/image/twitter-x.svg";
import Instagram from "../../../../public/image/instagram.svg";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import useSWR from "swr";

interface FeaturedMediaCardProps {
  user: User;
}
const FeaturedMediaCard = ({ user }: FeaturedMediaCardProps) => {
  const { data: recentVideo } = useSWR(
    user.youtube ? `/api/media-content/${user.id}` : null,
    async () => {
      const { data: recentPublishedVideo, error } = await supabase
        .from(DB_TABLES.MEDIA_CONTENT)
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "youtube_video")
        .eq("tag", "latest")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error("Error fetching YouTube video: " + error.message);
      }

      return recentPublishedVideo || null;
    },
  );
  return (
    <Card key={user.id} className="overflow-hidden hover:border-primary transition-all">
      <CardContent className="p-0">
        <div className="p-4 flex items-center gap-4 border-b border-border">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{user.name}</h3>
            <Badge className="bg-primary text-primary-foreground border-primary">Media</Badge>
            {/* <p className="text-sm text-muted-foreground mt-1">{user.outlet}</p> */}
          </div>
        </div>

        <div className="p-4">
          {user.bio ? (
            <p className="text-sm text-muted-foreground mb-2 h-[80px] line-clamp-4">{user.bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground mb-2 h-[80px]">No bio found</p>
          )}

          <div className="flex gap-4 mb-4">
            {user.youtube && (
              <Link
                href={user.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600"
              >
                <Image src={Youtube} width={20} height={20} alt="youtube" />
              </Link>
            )}
            {user.twitter && (
              <Link
                href={user.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600"
              >
                <Image
                  src={PlatformX}
                  width={14}
                  height={14}
                  alt="platform-x"
                  className="filter brightness-0 dark:filter-none"
                />
              </Link>
            )}
            {user.instagram && (
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={user.instagram || "#"}
                className="flex items-center gap-2 text-blue-600"
              >
                <Image
                  src={Instagram}
                  width={20}
                  height={20}
                  alt="instagram"
                  className="filter brightness-0 dark:filter-none"
                />
              </Link>
            )}
            {user.website && (
              <Link
                href={user.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            )}
          </div>

          <h4 className="font-medium mb-2">Recent Content</h4>
          <div className="space-y-2">
            {recentVideo ? (
              <Link
                href={recentVideo?.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-muted text-muted-foreground p-2 rounded-md transition-colors"
              >
                <div className="flex gap-3">
                  {recentVideo.thumbnail_img && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={recentVideo.thumbnail_img || "/placeholder.svg"}
                        alt={recentVideo.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{recentVideo.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs mr-2">
                        Youtube
                      </Badge>
                      <div className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {recentVideo.likes}
                      </div>
                      <span className="mx-2">•</span>
                      <span>
                        {recentVideo?.date
                          ? new Date(recentVideo.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm">No recent content found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default FeaturedMediaCard;
