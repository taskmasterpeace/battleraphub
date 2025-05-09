"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingCard } from "@/components/pages/battlers/details/RatingCard";
import { Attribute, BattlerAnalytics, Battlers } from "@/types";
import { CATEGORY_TYPES } from "@/config";
import { useBattler } from "@/contexts/battler.context";
import AutoComplete from "@/components/auto-complete";

interface AnalyticsTabProps {
  battlerData: Battlers | undefined;
  attributeData: Attribute[];
}

const colorOptions = ["#8884d8", "#82ca9d", "#ffc658"];

export default function AnalyticsTab({ battlerData, attributeData }: AnalyticsTabProps) {
  const {
    battlerAnalytics,
    battlerRatings,
    battlersData,
    fetchBattlerAnalytics,
    setSearchQuery,
    searchQuery,
  } = useBattler();
  const [selectedBattler, setSelectedBattler] = useState<Battlers | null>(null);
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

  const generateChartData = (
    ratingData: { attribute_id: number; score: number }[],
  ): {
    [key: string]: {
      title: string;
      description: string;
      data: { name: string; value: string }[];
      barColor: string;
    };
  } => {
    const data: {
      [key: string]: {
        title: string;
        description: string;
        data: {
          name: string;
          value: string;
        }[];
        barColor: string;
      };
    } = {};
    Object.values(CATEGORY_TYPES).forEach((category, index) => {
      data[category] = {
        title: category.charAt(0).toUpperCase() + category.slice(1),
        description: `${category} attributes ratings`,
        data: [],
        barColor: colorOptions[index],
      };
    });

    const attributeMapper = attributeData.reduce(
      (acc: { [key: string]: { name: string; category: string } }, attr) => {
        acc[attr.id] = { name: attr.name, category: attr.category };
        return acc;
      },
      {},
    );

    ratingData.forEach((item) => {
      const attribute = attributeMapper[item.attribute_id];
      data[attribute.category].data.push({
        name: attribute.name,
        value: item.score?.toString() || "0",
      });
    });

    return data;
  };

  const generateComparisonChartData = () => {
    const battlerAnalyticsData = generateChartData(battlerAnalytics);
    const selectedBattlerAnalyticsData = generateChartData(selectedBattlerAnalytics);

    const mergedData: {
      [key: string]: {
        title: string;
        description: string;
        data: { name: string; [key: string]: string }[];
        barColor: string;
      };
    } = {};

    Object.keys(battlerAnalyticsData).forEach((key) => {
      const data = battlerAnalyticsData[key].data.map((item) => {
        const selectedItem = selectedBattlerAnalyticsData[key].data.find(
          (selectedItem) => selectedItem.name === item.name,
        );
        return {
          name: item.name,
          [battlerData?.name || ""]: item.value,
          [selectedBattler?.name || ""]: selectedItem?.value || "0",
        };
      });

      mergedData[key] = {
        title: battlerAnalyticsData[key].title,
        description: battlerAnalyticsData[key].description,
        data,
        barColor: battlerAnalyticsData[key].barColor,
      };
    });

    return mergedData;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <AutoComplete
          placeholderText={selectedBattler?.name || battlersData[0]?.name || "Select battler..."}
          options={battlersData}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          selectedOption={selectedBattler as Battlers}
          setSelectedOption={(value) => setSelectedBattler(value as Battlers)}
        />
      </div>

      <Tabs defaultValue="my-ratings">
        <TabsList className="mb-6">
          <TabsTrigger value="my-ratings">My Ratings</TabsTrigger>
          <TabsTrigger value="community">Community Ratings</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="my-ratings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(generateChartData(battlerRatings)).map((item, index) => {
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

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(generateChartData(battlerAnalytics)).map((item, index) => {
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
            {Object.values(generateComparisonChartData()).map((item, index) => {
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
