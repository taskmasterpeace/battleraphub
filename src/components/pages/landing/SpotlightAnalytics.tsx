"use client";

import { useState, useEffect } from "react";
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
} from "@/components/pages/landing/LineChart";
import { BarChartIcon as ChartSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { spotlightAnalytics } from "@/__mocks__/landing";
import { AnalyticsData } from "@/types";

export default function SpotlightAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setAnalytics(spotlightAnalytics);
    setIsLoading(false);
  }, []);

  const nextAnalytic = () => {
    setActiveIndex((prev) => (prev + 1) % analytics.length);
  };

  const prevAnalytic = () => {
    setActiveIndex((prev) => (prev - 1 + analytics.length) % analytics.length);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 animate-pulse">
        <CardContent className="p-4 h-96"></CardContent>
      </Card>
    );
  }

  if (analytics.length === 0) return null;

  const currentAnalytic = analytics[activeIndex];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ChartSquare className="w-5 h-5 mr-2 text-cyan-400" />
          <h2 className="text-2xl font-bold">Spotlight Analytics</h2>
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

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentAnalytic.title}</CardTitle>
              <p className="text-sm text-gray-400 mt-1">{currentAnalytic.description}</p>
            </div>
            <Badge variant="outline" className="bg-gray-800">
              {activeIndex + 1} / {analytics.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentAnalytic.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    color: "#E5E7EB",
                  }}
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
              <Link href="/analytics">View Full Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
