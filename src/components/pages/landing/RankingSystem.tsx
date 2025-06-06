"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopBattlersUnweighted } from "@/types";
import { useHome } from "@/contexts/home.context";
import { PAGES, RANKING_TYPE } from "@/config";

interface RankingSystemProps {
  compact?: boolean;
  showTitle?: string;
}

type RankingTypes = "weighted" | "unweighted";

export default function RankingSystem({ compact = false, showTitle }: RankingSystemProps) {
  const { topBattlersWeightedData, topBattlersUnweightedData } = useHome();
  const [rankingType, setRankingType] = useState<RankingTypes>("weighted");
  const [battlers, setBattlers] = useState<TopBattlersUnweighted[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let filteredBattlers =
      rankingType === RANKING_TYPE.WEIGHTED ? topBattlersWeightedData : topBattlersUnweightedData;

    filteredBattlers.sort((a, b) => {
      return b.avg_rating - a.avg_rating;
    });

    if (compact) {
      filteredBattlers = filteredBattlers.slice(0, 5);
    }

    setBattlers(filteredBattlers as TopBattlersUnweighted[]);
    setIsLoading(false);
  }, [rankingType, compact, topBattlersWeightedData, topBattlersUnweightedData]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        <h2 className="text-2xl font-bold">{showTitle || "Battle Rap Rankings"}</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Tabs
          value={rankingType}
          onValueChange={(value) => setRankingType(value as RankingTypes)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weighted">Weighted</TabsTrigger>
            <TabsTrigger value="unweighted">Unweighted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{showTitle}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {battlers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No battlers match your current filters
                </div>
              ) : (
                battlers.map((battler, index) => (
                  <Link
                    key={battler.battler_id}
                    href={`${PAGES.BATTLERS}/${battler.battler_id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border hover:border-blue-500 transition-all">
                      <div className="flex-shrink-0 w-8 text-center font-bold text-lg text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={battler.avatar || "/placeholder.svg"}
                          alt={battler.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{battler.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{battler.location}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {rankingType === RANKING_TYPE.WEIGHTED
                            ? battler?.avg_rating?.toFixed(1)
                            : battler?.avg_rating?.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rankingType === RANKING_TYPE.WEIGHTED
                            ? "Weighted Rating"
                            : "Unweighted Rating"}
                        </p>
                      </div>
                      {/* <div className="text-center w-20">
                        <div
                          className={`flex items-center justify-center ${
                            battler.change && battler.change > 0
                              ? "text-success"
                              : battler.change && battler.change < 0
                                ? "text-destructive"
                                : "text-muted-foreground"
                          }`}
                        >
                          {battler.change && battler.change > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : battler.change && battler.change < 0 ? (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          )}
                          <span>
                            {battler.change && battler.change > 0 ? "+" : ""}
                            {battler.change?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{battler.updated_at}</p>
                      </div> */}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {compact && battlers.length > 0 && (
            <div className="mt-4 text-center">
              <Button asChild variant="outline">
                <Link href={PAGES.BATTLERS}>View All Battlers</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
