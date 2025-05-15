import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video as VideoType } from "@/types/youtube";
import { ExternalLink, ThumbsUp, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TrendingVideoCardProps {
  content: VideoType;
  userId: string;
  idx: number;
}

const TrendingVideoCard = ({ content, userId, idx }: TrendingVideoCardProps) => {
  const videoUrl = `https://www.youtube.com/watch?v=${content.videoId}`;
  const date = content.publishedAt
    ? new Date(content.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      key={`${userId}-${idx}`}
      href={videoUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary transition-all"
    >
      {content.thumbnail ? (
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={content.thumbnail || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
          <Video className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 ">
          <Badge className="bg-primary text-primary-foreground border-primary">
            {content.title}
          </Badge>
          <Badge variant="outline">{content.tag}</Badge>
        </div>
        {content?.description ? <p className="font-medium my-1">{content.description}</p> : null}
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <ThumbsUp className="w-3 h-3 mr-1" />
            {content.likes}
          </div>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="flex-shrink-0">
        <ExternalLink className="w-4 h-4" />
      </Button>
    </Link>
  );
};

export default TrendingVideoCard;
