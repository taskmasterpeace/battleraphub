import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { Video } from "@/types/youtube";
import { ExternalLink, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Youtube from "../../../../public/image/youtube.svg";
import PlatformX from "../../../../public/image/twitter-x.svg";
import Instagram from "../../../../public/image/instagram.svg";

interface FeaturedMediaCardProps {
  user: User;
  videos: Video[];
}
const FeaturedMediaCard = ({ user, videos }: FeaturedMediaCardProps) => {
  const recentVideo = videos?.[0];

  return (
    <Card key={user.id} className="overflow-hidden hover:border-primary transition-all">
      <CardContent className="p-0">
        <div className="p-4 flex items-center gap-4 border-b border-border">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-lg">{user.name}</h3>
            <Badge className="bg-primary text-primary-foreground border-primary">Media</Badge>
            {/* <p className="text-sm text-muted-foreground mt-1">{user.outlet}</p> */}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-foreground/50 mb-4 line-clamp-5">{user.bio}</p>

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
                href={`https://www.youtube.com/watch?v=${recentVideo.videoId}` || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-muted text-muted-foreground p-2 rounded-md transition-colors"
              >
                <div className="flex gap-3">
                  {recentVideo.thumbnail && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={recentVideo.thumbnail || "/placeholder.svg"}
                        alt={recentVideo.title}
                        fill
                        className="object-cover rounded-md"
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
                        {recentVideo?.publishedAt
                          ? new Date(recentVideo.publishedAt).toLocaleDateString("en-US", {
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
