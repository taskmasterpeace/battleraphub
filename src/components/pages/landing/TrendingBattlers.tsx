"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star } from "lucide-react";
import { useHome } from "@/contexts/home.context";

export default function TrendingBattlers() {
  const { topBattlersUnweightedData: battlers, battlerUnweightedLoading } = useHome();
  const [activeTagId, setActiveTagId] = useState<string>("");

  const handleBadgeClick = (e: React.MouseEvent, battlerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTagId(activeTagId === battlerId ? "" : battlerId);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-2xl font-bold">Trending Battlers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {battlerUnweightedLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="bg-foreground border-border animate-pulse">
                  <CardContent className="p-4 h-64"></CardContent>
                </Card>
              ))
          : battlers.map((battler) => {
              const validTags = battler.assigned_badges?.filter((tag) => tag.name) || [];
              const isExpanded = activeTagId === battler.battler_id;
              const shouldCollapse = validTags.length > 4;
              const displayTags = shouldCollapse && !isExpanded ? validTags.slice(0, 3) : validTags;
              return (
                <Link
                  key={battler.battler_id}
                  href={`/battlers/${battler.battler_id}`}
                  className="group h-full"
                >
                  <Card className="overflow-hidden hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-900/20 group-hover:transform group-hover:translate-y-[-5px] duration-300 h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative aspect-square">
                        <Image
                          src={battler.avatar || "/placeholder.svg"}
                          alt={battler.name}
                          fill
                          className="object-cover w-full"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            className={
                              "bg-success/20 dark:bg-success/30 border-success dark:border-none text-success"
                            }
                          >
                            + 0.5
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-lg">{battler.name}</h3>
                            <p className="text-sm text-muted-foreground">{battler.location}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-blue-500 fill-blue-500 mr-1" />
                            <span className="font-bold">{battler?.avg_rating?.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          <div className="flex flex-wrap gap-2">
                            {displayTags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="rounded-md h-6">
                                {tag.name}
                              </Badge>
                            ))}

                            {shouldCollapse && (
                              <Badge
                                variant="outline"
                                className="rounded-md cursor-pointer h-6"
                                onClick={(e) => handleBadgeClick(e, battler.battler_id)}
                              >
                                {isExpanded ? "Show less" : `+${validTags.length - 3} more`}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
