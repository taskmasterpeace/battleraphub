"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, MessageSquare, Award } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/components/ui/chart";
import { CommunityStatCards } from "@/types";
import { useHome } from "@/contexts/home.context";

export default function CommunityPulse() {
  const [stats, setStats] = useState<CommunityStatCards | null>(null);
  const { communityStats, mostAssignBadges, ratingsOverTimeData } = useHome();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setStats(communityStats);
    setIsLoading(false);
  }, [communityStats]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 h-64"></CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardContent className="p-4 h-64"></CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-blue-400" />
        <h2 className="text-2xl font-bold">Community Pulse</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Community Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                <span>Total Ratings</span>
              </div>
              <span className="font-bold">{stats?.total_ratings?.toLocaleString() || "0"}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                <span>Active Users</span>
              </div>
              <span className="font-bold">
                {stats?.active_users_last_30_days?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                <span>Recent Battles</span>
              </div>
              <span className="font-bold">-</span>
            </div>

            <div className="pt-2">
              <div className="flex items-center mb-2">
                <Award className="w-4 h-4 mr-2 text-yellow-400" />
                <span>Top Badges</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {mostAssignBadges?.slice(0, 5)?.map((item, index) => (
                  <Badge key={index} className="bg-gray-800 text-gray-300">
                    {item.badge_name} ({item.assigned_count})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Rating Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ratingsOverTimeData.map((data) => ({
                    month: new Date(data.month).toLocaleString("en-US", { month: "long" }),
                    avg_rating: data?.avg_rating,
                    total_ratings: data?.total_ratings,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    content={({ payload, label }) => (
                      <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                        <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                      </div>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_ratings"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
