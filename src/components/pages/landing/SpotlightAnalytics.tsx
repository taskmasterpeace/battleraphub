"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "@/components/ui/chart";
import { BarChartIcon as ChartSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHome } from "@/contexts/home.context";
import { PAGES } from "@/config";

export default function SpotlightAnalytics() {
  const { mostValuesAttributes, mostAssignBadges } = useHome();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const spotlightAnalytics = useMemo(
    () => [
      {
        title: "Top Performing Attributes",
        description: "Highest rated attributes across all battlers",
        chartData:
          mostValuesAttributes.slice(0, 5).map((item) => ({
            name: item.attribute_name,
            value: item.avg_rating,
          })) || [],
        xDataKey: "name",
        dataKey: "value",
        color: "#8B5CF6",
      },
      {
        title: "Most Improved Battlers",
        description: "Battlers with the biggest rating increases",
        chartData: [
          { name: "Geechi Gotti", value: 0.8 },
          { name: "Tay Roc", value: 0.6 },
          { name: "Chess", value: 0.5 },
          { name: "Rum Nitty", value: 0.4 },
          { name: "JC", value: 0.3 },
        ],
        xDataKey: "name",
        dataKey: "value",
        color: "#10B981",
      },
      {
        title: "Most Assigned Badges",
        description: "Most frequently assigned badges by the community",
        chartData:
          mostAssignBadges.slice(0, 5).map((item) => ({
            name: item.badge_name,
            value: item.assigned_count,
          })) || [],
        xDataKey: "name",
        dataKey: "value",
        color: "#F59E0B",
      },
    ],
    [mostValuesAttributes, mostAssignBadges],
  );

  const nextAnalytic = () => {
    setActiveIndex((prev) => (prev + 1) % spotlightAnalytics.length);
  };

  const prevAnalytic = () => {
    setActiveIndex((prev) => (prev - 1 + spotlightAnalytics.length) % spotlightAnalytics.length);
  };

  if (spotlightAnalytics.length === 0) return null;

  const currentAnalytic = spotlightAnalytics[activeIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <ChartSquare className="w-5 h-5 mr-2 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-bold">Spotlight Analytics</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevAnalytic}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextAnalytic}>
            Next
          </Button>
        </div>
      </div>

      <Card className="">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentAnalytic.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{currentAnalytic.description}</p>
            </div>
            <Badge variant="outline" className="w-[60px] sm:w-[50px]">
              {activeIndex + 1} / {spotlightAnalytics.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnalytic.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey={currentAnalytic.xDataKey}
                  stroke="#9CA3AF"
                  className="text-[12px]"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-muted text-foreground rounded-md p-3">
                      <p className="text-sm">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar
                  dataKey={currentAnalytic.dataKey}
                  fill={currentAnalytic.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={PAGES.ANALYTICS}>View Full Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
