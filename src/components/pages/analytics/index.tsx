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
import {
  attributeBreakdownData,
  battlers,
  communityData,
  defaultMockData,
  mostCommonNegativeBadgesData,
  mostCommonPositiveBadgesData,
  mostValuedAttributesData,
  ratingTrendsData,
} from "@/__mocks__/analytics";
import RoleBasedAnalytics from "@/components/pages/analytics/RoleBasedAnalytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsContentPage = () => {
  const [analyticsData, setAnalyticsData] = useState(defaultMockData);
  const [selectedBattler, setSelectedBattler] = useState("1");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to load data from localStorage
    function loadMockData() {
      setIsLoading(true);
      try {
        // Check if we have mock data in localStorage
        if (typeof window !== "undefined") {
          // const storedData = localStorage.getItem("mockAnalyticsData");

          // if (storedData) {
          //   console.log("Found mock data in localStorage");
          //   setAnalyticsData(JSON.parse(storedData));
          // } else {
          setAnalyticsData(defaultMockData);
          // }
        }
      } catch (error) {
        console.error("Error loading mock data:", error);
        setAnalyticsData(defaultMockData);
      } finally {
        setIsLoading(false);
      }
    }

    loadMockData();
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
              loading={isLoading}
            >
              <BarChart
                layout="vertical"
                data={analyticsData.topRatedBattlers.map((b) => ({
                  name: b.name,
                  rating: b.total_points,
                }))}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="rating" fill="#8884d8" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Category Averages"
              description="Average ratings by category"
              loading={isLoading}
            >
              <BarChart
                data={analyticsData.categoryAverages}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="average" fill="#82ca9d" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Rating Trends"
              description="Average ratings over time"
              loading={isLoading}
            >
              <LineChart
                data={analyticsData.trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[7, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="role-based">
          <RoleBasedAnalytics />
        </TabsContent>

        <TabsContent value="battler">
          <div className="mb-6 flex justify-end">
            <Select value={selectedBattler} onValueChange={setSelectedBattler}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select battler" />
              </SelectTrigger>
              <SelectContent>
                {battlers.map((battler) => (
                  <SelectItem key={battler.id} value={battler.id}>
                    {battler.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Attribute Breakdown"
              description="Detailed ratings for each attribute"
              height="400px"
              className="lg:col-span-2"
            >
              <BarChart
                data={attributeBreakdownData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#8884d8" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Most Common Positive Badges"
              description="Badges most frequently assigned"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={mostCommonPositiveBadgesData}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Most Common Negative Badges"
              description="Badges most frequently assigned"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={mostCommonNegativeBadgesData}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#ff8042" />
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
              <BarChart data={communityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Most Valued Attributes"
              description="Attributes with highest average ratings"
              height="300px"
            >
              <BarChart
                layout="vertical"
                data={mostValuedAttributesData}
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 10]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="average" fill="#82ca9d" />
              </BarChart>
            </ChartCard>

            <ChartCard
              title="Rating Trends Over Time"
              description="How community ratings have changed"
              height="300px"
            >
              <LineChart
                data={ratingTrendsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[7, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="writing" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
                <Line type="monotone" dataKey="personal" stroke="#ffc658" />
              </LineChart>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsContentPage;
