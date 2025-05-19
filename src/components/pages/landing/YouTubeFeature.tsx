"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { getLatestVideos } from "@/lib/youtube-service";
import { Video } from "@/types/youtube";

export default function YouTubeFeature() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const latestVideos = await getLatestVideos();
        setVideos(latestVideos);
      } catch (err) {
        console.error("Error loading featured videos:", err);
        setError("Failed to load videos. Using default content.");
        // Even if there's an error, we should have mock data from the service
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="h-full w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-foreground">Loading video...</p>
      </div>
    );
  }

  if (videos?.length === 0) {
    return (
      <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-foreground">No videos available</p>
      </div>
    );
  }

  const currentVideo = videos?.[currentIndex];

  return (
    <div className="relative h-full w-full">
      <Card className="overflow-hidden h-full">
        <CardContent className="p-0 relative h-full">
          <div className="relative aspect-video w-full h-full">
            <Image
              src={
                currentVideo?.thumbnail ||
                "/placeholder.svg?height=180&width=320&text=Battle+Rap+Stories"
              }
              alt={currentVideo?.title || "Battle Rap Stories"}
              width={320}
              height={180}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => openVideo(currentVideo?.videoId)}
            >
              <Button
                variant="default"
                size="lg"
                className="rounded-xl bg-destructive hover:bg-destructive/20"
              >
                <Play className="h-5 w-5 fill-current" />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
            <h3 className="font-medium text-lg text-foreground mb-2">{currentVideo?.title}</h3>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevSlide} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextSlide} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs hover:bg-destructive"
                onClick={() => openVideo(currentVideo?.videoId)}
              >
                Watch on YouTube
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1">
        {videos?.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-destructive" : "bg-muted"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {error && (
        <div className="absolute top-0 right-0 bg-destructive text-white text-xs px-2 py-1 rounded-bl-md">
          {error}
        </div>
      )}
    </div>
  );
}
