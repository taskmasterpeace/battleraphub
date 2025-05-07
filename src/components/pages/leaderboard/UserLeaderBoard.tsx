"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, Trophy, TrendingUp, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from "@/components/pages/leaderboard/LeaderboardSection";
import { useLeaderboard } from "@/contexts/leaderboard.context";
import { FilteredData } from "@/types";
import Link from "next/link";
import { LEADERBOARD_TAB_TYPE } from "@/config";

export default function UserLeaderboard({
  tabType,
}: {
  tabType: "most-ratings" | "most-accurate" | "most-followed";
}) {
  const {
    topRaterBattlerLoading,
    mostConsistentUsersLoading,
    mostInfluentialUsersLoading,
    topRatersBattler,
    mostConsistentUsers,
    mostInfluentialUsers,
    mostAccurateUsers,
    mostAccurateUsersLoading,
  } = useLeaderboard();
  const [activeTab, setActiveTab] = useState("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<FilteredData[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getDataForTab = {
      overall:
        tabType === LEADERBOARD_TAB_TYPE.MOST_RATINGS
          ? topRatersBattler
          : tabType === LEADERBOARD_TAB_TYPE.MOST_ACCURATE
            ? mostAccurateUsers
            : [],
      consistency: tabType === LEADERBOARD_TAB_TYPE.MOST_RATINGS ? mostConsistentUsers : [],
      influence: tabType === LEADERBOARD_TAB_TYPE.MOST_RATINGS ? mostInfluentialUsers : [],
    };

    const currentData = getDataForTab[activeTab as keyof typeof getDataForTab] || [];
    const filtered =
      searchQuery.trim() === ""
        ? currentData
        : currentData.filter((entry) =>
            entry?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
          );

    setFilteredData(filtered as FilteredData[]);
  }, [
    searchQuery,
    tabType,
    activeTab,
    topRatersBattler,
    mostConsistentUsers,
    mostInfluentialUsers,
    mostAccurateUsers,
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              User Leaderboard
            </CardTitle>
            <CardDescription>Top contributors ranked by ratings and influence</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-gray-800 border-gray-700"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="overall">
              <Trophy className="h-4 w-4 mr-2" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="consistency">
              <BarChart2 className="h-4 w-4 mr-2" />
              Consistency
            </TabsTrigger>
            <TabsTrigger value="influence">
              <TrendingUp className="h-4 w-4 mr-2" />
              Influence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            {topRaterBattlerLoading || mostAccurateUsersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No Data Found</div>
            ) : (
              <LeaderboardSection
                data={filteredData}
                sortKey="battlers_rated"
                sortDirection="asc"
                valueKey={
                  tabType === LEADERBOARD_TAB_TYPE.MOST_RATINGS
                    ? "battlers_rated"
                    : tabType === LEADERBOARD_TAB_TYPE.MOST_ACCURATE
                      ? "accuracy_score"
                      : "accuracy_score"
                }
                valueLabel="Ratings"
              />
            )}

            <div className="flex justify-center pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/my-ratings">View All Rankings</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            {mostConsistentUsersLoading ? (
              <SkeletonLoader />
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No Data Found</div>
            ) : (
              <LeaderboardSection
                data={filteredData}
                sortKey="ratings_given"
                sortDirection="asc"
                valueKey="ratings_given"
                valueLabel="Consistency"
              />
            )}
          </TabsContent>

          <TabsContent value="influence" className="space-y-4">
            {mostInfluentialUsersLoading ? (
              <SkeletonLoader />
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No Data Found</div>
            ) : (
              <LeaderboardSection
                data={filteredData}
                sortKey="ratings_given"
                sortDirection="asc"
                valueKey="ratings_given"
                valueLabel="Ratings"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-semibold text-gray-700">
          #
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-800" />
        <div>
          <div className="w-24 h-4 bg-gray-800 rounded mb-1" />
          <div className="w-20 h-3 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="text-right">
        <div className="w-12 h-4 bg-gray-800 rounded mb-1" />
        <div className="w-16 h-3 bg-gray-800 rounded" />
      </div>
    </div>
  );
};
