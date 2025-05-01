"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartCard } from "./ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import RoleBasedAnalytics from "@/components/pages/analytics/RoleBasedAnalytics";
import { Attribute, Battlers } from "@/types";
import AutoComplete from "@/components/auto-complete";
import { useAnalytics } from "@/contexts/analytics.context";

interface AnalyticsProps {
  attributeData: Attribute[];
}

const AnalyticsContentPage = ({ attributeData }: AnalyticsProps) => {
  const {
    battlerAnalytics,
    battlersData,
    searchQuery,
    averageRatingByCategoryData,
    ratingsOverTimeData,
    ratingDistributionData,
    mostValuesAttributes,
    topBattlersUnweightedData,
    topPositiveBadges,
    topNegativeBadges,
    trendOverTimeByCategory,
    setSearchQuery,
  } = useAnalytics();
  const [selectedBattler, setSelectedBattler] = useState<Battlers | null>(null);

  useEffect(() => {
    setSelectedBattler(battlersData?.[0]);
  }, [battlersData]);

  // Attribute Breakdown
  const filterBattlerAnalytics =
    selectedBattler || (battlersData && battlersData[0])
      ? attributeData
          .map((attribute) => {
            const analytics = battlerAnalytics?.filter(
              (analytics) =>
                analytics.attribute_id === attribute.id &&
                analytics.battler_id === (selectedBattler?.id || battlersData?.[0]?.id),
            );
            return analytics?.map((analytic) => ({
              name: attribute.name,
              score: analytic.score.toFixed(2),
            }));
          })
          .flat()
          .filter(Boolean)
      : [];

  // Community Rating Distribution
  const filterRatingDistribution = ratingDistributionData.reduce<
    Array<{ bucket: string; rating_count: number }>
  >((acc, data, index, array) => {
    if (index === array.length - 1) return acc;
    if (index === array.length - 2) {
      return [
        ...acc,
        {
          bucket: "9-10",
          rating_count: data.rating_count + array[array.length - 1].rating_count,
        },
      ];
    }
    return [
      ...acc,
      {
        bucket: `${Number(data?.bucket) - 1}-${data.bucket}`,
        rating_count: data.rating_count,
      },
    ];
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8 bg-gray-900 border border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="role-based">Role-Based</TabsTrigger>
          <TabsTrigger value="battler">Battler Analysis</TabsTrigger>
          <TabsTrigger value="community">Community Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ChartCard
              title="Top Rated Battlers"
              description="Overall ratings across all categories"
            >
              <BarChart
                layout="vertical"
                data={topBattlersUnweightedData}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="avg_rating" domain={[0, 10]} />
                <YAxis dataKey="name" type="category" width={70} className="text-[12px]" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="avg_rating" fill="#8884d8" />
              </BarChart>
            </ChartCard>
            <ChartCard title="Category Averages" description="Average ratings by category">
              <BarChart
                data={averageRatingByCategoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" className="text-[12px]" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="avg_rating" fill="#82ca9d" />
              </BarChart>
            </ChartCard>
            <ChartCard title="Rating Trends" description="Average ratings over time">
              <LineChart
                data={ratingsOverTimeData.map((data) => ({
                  month: new Date(data.month).toLocaleString("en-US", { month: "long" }),
                  avg_rating: data?.avg_rating,
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" className="text-[12px]" />
                <YAxis domain={[0, 10]} className="text-[10px]" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Line type="monotone" dataKey="avg_rating" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ChartCard>{" "}
          </div>
        </TabsContent>

        <TabsContent value="role-based">
          <RoleBasedAnalytics attributeData={attributeData} />
        </TabsContent>

        <TabsContent value="battler">
          <div className="mb-6 flex justify-end">
            <AutoComplete
              placeholderText={selectedBattler?.name || "Select battler..."}
              options={battlersData as Battlers[]}
              setSearchQuery={setSearchQuery}
              searchQuery={searchQuery}
              selectedOption={selectedBattler as Battlers}
              setSelectedOption={(value) => setSelectedBattler(value as Battlers)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Attribute Breakdown"
              description="Detailed ratings for each attribute"
              height="400px"
              className="lg:col-span-2"
            >
              <BarChart
                data={filterBattlerAnalytics}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  className="text-[10px]"
                  angle={-15}
                  textAnchor="end"
                  domain={attributeData?.map((data) => data?.name)}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Most Common Positive Badges"
              description="Badges most frequently assigned"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={topPositiveBadges}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="badge_name" type="category" className="text-[12px]" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="times_assigned" fill="#82ca9d" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Most Common Negative Badges"
              description="Badges most frequently assigned"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={topNegativeBadges}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="badge_name" type="category" className="text-[12px]" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="times_assigned" fill="#ff8042" />
              </BarChart>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard
              title="Community Rating Distribution"
              description="How the community rates battlers overall"
              height="400px"
              className="md:col-span-2"
            >
              <BarChart
                data={filterRatingDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="rating_count" fill="#8884d8" />
              </BarChart>
            </ChartCard>
            <ChartCard
              title="Most Valued Attributes"
              description="Attributes with highest average ratings"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={mostValuesAttributes}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} />
                <YAxis dataKey="attribute_name" type="category" className="text-[12px]" />
                <Tooltip
                  content={({ payload, label }) => (
                    <div className="bg-gray-700 border border-gray-400 rounded-md p-3">
                      <p className="text-sm text-white">{`${label} : ${payload?.[0]?.value}`}</p>
                    </div>
                  )}
                />
                <Bar dataKey="avg_rating" fill="#82ca9d" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Rating Trends Over Time"
              description="How community ratings have changed"
              height="300px"
            >
              <LineChart
                data={trendOverTimeByCategory}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" className="text-[10px]" />
                <YAxis domain={[0, 10]} dataKey="avg_rating" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="writing"
                  name="Writing"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="performance" name="Performance" stroke="#82ca9d" />
                <Line type="monotone" dataKey="personal" name="Personal" stroke="#ffc658" />
              </LineChart>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AnalyticsContentPage;
