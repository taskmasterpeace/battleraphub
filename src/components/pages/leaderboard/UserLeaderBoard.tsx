"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, Trophy, TrendingUp, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from "@/components/pages/leaderboard/LeaderboardSection";
import { LeaderboardEntry } from "@/types";
import { leaderboardMockData } from "@/__mocks__/leaderboard";

export default function UserLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboard(leaderboardMockData);
        setFilteredLeaderboard(leaderboardMockData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter(
        (entry) =>
          entry.displayName.toLowerCase().includes(query.toLowerCase()) ||
          entry.username.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredLeaderboard(filtered);
    }
  };

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
        <Tabs defaultValue="overall" className="space-y-4">
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
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <LeaderboardSection
                data={filteredLeaderboard}
                sortKey="rank"
                sortDirection="asc"
                valueKey="totalRatings"
                valueLabel="Ratings"
                useIndex={false}
              />
            )}

            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm">
                View All Rankings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <LeaderboardSection
                data={filteredLeaderboard}
                sortKey="consistency"
                valueKey="consistency"
                valueLabel="Consistency"
              />
            )}
          </TabsContent>

          <TabsContent value="influence" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No users found</div>
            ) : (
              <LeaderboardSection
                data={filteredLeaderboard}
                sortKey="rank"
                sortDirection="asc"
                valueKey="totalRatings"
                valueLabel="Ratings"
                useIndex={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
