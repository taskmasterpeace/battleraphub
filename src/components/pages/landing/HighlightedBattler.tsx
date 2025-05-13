"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, TrendingUp, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useHome } from "@/contexts/home.context";
import { Battlers } from "@/types";

export default function HighlightedBattler() {
  const { highlightBattlers, tagsData, highlightBattlerLoading } = useHome();
  const [filteredBattlers, setFilteredBattlers] = useState<Battlers[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredBattlers(highlightBattlers);
    } else {
      const filtered = highlightBattlers.filter((battler) =>
        selectedTags.every((tag) => battler?.battler_tags?.some((bt) => bt.tags.name === tag)),
      );
      setFilteredBattlers(filtered);
    }

    setCurrentIndex(0);
  }, [selectedTags, highlightBattlers]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  };

  const nextBattler = () => {
    if (filteredBattlers.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % filteredBattlers.length);
    }
  };

  const prevBattler = () => {
    if (filteredBattlers.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + filteredBattlers.length) % filteredBattlers.length);
    }
  };

  if (highlightBattlerLoading) {
    return (
      <Card className="bg-muted animate-pulse h-full">
        <CardContent className="bg-muted p-0 h-96"></CardContent>
      </Card>
    );
  }

  if (filteredBattlers.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-destructive" />
            <h2 className="text-2xl font-bold">Highlighted Battler</h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              {tagsData.length > 0 &&
                tagsData.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name || "")}
                    onCheckedChange={() => handleTagToggle(tag.name || "")}
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="border-border h-full flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No battlers match your selected filters</p>
            <Button variant="outline" onClick={() => setSelectedTags([])}>
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentBattler = filteredBattlers[currentIndex];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Award className="w-5 h-5 mr-2 text-destructive" />
          <h2 className="text-2xl font-bold">Highlighted Battler</h2>
        </div>

        <div className="flex items-center gap-2">
          {filteredBattlers.length > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <Button variant="outline" size="icon" onClick={prevBattler}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1}/{filteredBattlers.length}
              </span>
              <Button variant="outline" size="icon" onClick={nextBattler}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tags options</DropdownMenuLabel>
              {tagsData.length > 0 &&
                tagsData.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name || "")}
                    onCheckedChange={() => handleTagToggle(tag.name || "")}
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.div
        key={currentBattler?.id}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        <Card className="overflow-hidden h-full">
          <CardContent className="p-0 h-full">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/3 relative">
                <div className="aspect-square relative">
                  <Image
                    src={currentBattler?.avatar || "/image/default-avatar-img.jpg"}
                    alt={currentBattler?.name || "battler-avatar"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-foreground/90 text-white dark:bg-muted backdrop-blur-sm rounded-full p-1 px-3">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-blue-500 fill-blue-500 mr-1" />

                      <span className="font-bold text-lg">
                        {currentBattler?.battler_analytics?.find((analytic) => analytic.type === 1)
                          ?.score || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                    <div>
                      <h3 className="text-2xl font-bold">{currentBattler?.name}</h3>
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {currentBattler?.location}
                      </p>
                    </div>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="bg-destructive rounded-full p-1 self-start"
                    >
                      <TrendingUp className="w-5 h-5 text-muted" />
                    </motion.div>
                  </div>

                  <div>
                    {currentBattler?.bio ? (
                      <p className={`text-foreground my-4 text-ellipsis h-[250px] overflow-y-auto`}>
                        {currentBattler?.bio}
                      </p>
                    ) : (
                      <p className="text-foreground my-4 text-ellipsis h-56 overflow-y-auto">
                        No Bio
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Badges:</h4>
                    {currentBattler?.battler_badges && currentBattler?.battler_badges.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentBattler?.battler_badges
                          .map((badge, i) => (
                            <motion.div
                              key={`${badge.badges?.id}-${i}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                className={`bg-muted text-foreground ${
                                  badge.badges?.is_positive
                                    ? "bg-success-foreground dark:bg-success/20 text-success border-success hover:bg-success-foreground"
                                    : "bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive hover:bg-destructive-foreground"
                                }`}
                              >
                                {badge.badges?.name}
                              </Badge>
                            </motion.div>
                          ))
                          .slice(0, 10)}{" "}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Badge variant="secondary">-</Badge>
                      </div>
                    )}
                  </div>

                  {currentBattler?.battler_tags ? (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentBattler?.battler_tags?.map((tag) => (
                          <Badge key={tag.tags.id} variant="outline" className="text-foreground">
                            {tag.tags.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-foreground">
                      -
                    </Badge>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                  >
                    <Link href={`/battlers/${currentBattler?.id}`}>View Full Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
