"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingCard } from "@/components/pages/battlers/details/RatingCard";
import { Attribute, BattlerAnalytics, Battlers, ChartConfig } from "@/types";
import { CATEGORY_TYPES } from "@/config";
import { useBattler } from "@/contexts/battler.context";
import AutoComplete from "@/components/auto-complete";
import { useAuth } from "@/contexts/auth.context";
import {
  colorOptions,
  generateChartData,
  generateComparisonChartData,
} from "@/lib/static/static-data";

interface AnalyticsTabProps {
  battlerData: Battlers | undefined;
  attributeData: Attribute[];
}

export default function AnalyticsTab({ battlerData, attributeData }: AnalyticsTabProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const { battlerAnalytics, battlerRatings, battlersData, fetchBattlerAnalytics, setSearchQuery } =
    useBattler();
  const [selectedBattler, setSelectedBattler] = useState<Battlers | null>(battlersData[0]);
  const [selectedBattlerAnalytics, setSelectedBattlerAnalytics] = useState<BattlerAnalytics[]>([]);

  useEffect(() => {
    const getBattlerAnalytics = async () => {
      if (selectedBattler) {
        const analytics = await fetchBattlerAnalytics(selectedBattler.id, false);
        setSelectedBattlerAnalytics(analytics);
      }
    };
    getBattlerAnalytics();
  }, [selectedBattler, fetchBattlerAnalytics]);

  const chartConfig: ChartConfig = {
    categoryTypes: Object.values(CATEGORY_TYPES),
    colorOptions,
    attributes: attributeData,
  };

  const battlerAnalyticsData = generateChartData(battlerAnalytics, chartConfig);
  const battlerRatingsData = generateChartData(battlerRatings, chartConfig);
  const comparisonData = generateComparisonChartData(
    battlerAnalytics,
    selectedBattlerAnalytics,
    chartConfig,
    battlerData?.name || "",
    selectedBattler?.name || "",
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <AutoComplete
          placeholderText={selectedBattler?.name || battlersData[0]?.name || "Select battler..."}
          options={battlersData}
          setSearchQuery={setSearchQuery}
          selectedOption={selectedBattler as Battlers}
          setSelectedOption={(value) => setSelectedBattler(value as Battlers)}
        />
      </div>

      <Tabs defaultValue={userId ? "my-ratings" : "community"}>
        <TabsList className="mb-6">
          {userId && <TabsTrigger value="my-ratings">My Ratings</TabsTrigger>}
          <TabsTrigger value="community">Community Ratings</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {userId && (
          <TabsContent value="my-ratings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(battlerRatingsData).map((item, index) => {
                return (
                  <RatingCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    data={item.data}
                    barColor={item.barColor}
                    keys={["value"]}
                  />
                );
              })}
            </div>
          </TabsContent>
        )}

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(battlerAnalyticsData).map((item, index) => {
              return (
                <RatingCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  data={item.data}
                  barColor={item.barColor}
                  keys={["value"]}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(comparisonData).map((item, index) => {
              return (
                <RatingCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  data={item.data}
                  barColor={item.barColor}
                  keys={[battlerData?.name || "", selectedBattler?.name || ""]}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
