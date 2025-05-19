"use client";

import { createContext, useContext, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import {
  AverageRatingByCategory,
  AvgRatingsOverTime,
  BattlerAnalytics,
  Battlers,
  MostValuedAttributes,
  RatingCommunityDistribution,
  TopBadges,
  TopBattlersUnweighted,
  TrendOverTimeByCategory,
} from "@/types";
import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import useSWR from "swr";

type AnalyticsContextType = {
  topBattlersUnweightedData: TopBattlersUnweighted[];
  battlerAnalytics: BattlerAnalytics[];
  battlersData: Battlers[];
  topPositiveBadges: TopBadges[];
  topNegativeBadges: TopBadges[];
  trendOverTimeByCategory: TrendOverTimeByCategory[];
  averageRatingByCategoryData: AverageRatingByCategory[];
  ratingsOverTimeData: AvgRatingsOverTime[];
  ratingDistributionData: RatingCommunityDistribution[];
  mostValuesAttributes: MostValuedAttributes[];
  totalRatings: number;
  fetchBattlerAnalytics: () => Promise<void[]>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType>({
  topBattlersUnweightedData: [],
  battlerAnalytics: [],
  battlersData: [],
  topPositiveBadges: [],
  topNegativeBadges: [],
  trendOverTimeByCategory: [],
  averageRatingByCategoryData: [],
  ratingsOverTimeData: [],
  ratingDistributionData: [],
  mostValuesAttributes: [],
  totalRatings: 0,
  fetchBattlerAnalytics: async () => [],
  searchQuery: "",
  setSearchQuery: () => {},
});

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchTopBattlersUnweighted = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.TOP_BATTLERS_UNWEIGHTED)
      .select("*");
    if (error) {
      console.error("Error fetching top battlers unweighted data:", error);
    }
    if (error) throw error;
    return data as TopBattlersUnweighted[];
  };

  const { data: topBattlersUnweightedData = [] } = useSWR(
    "topBattlersUnweightedData?published=true",
    fetchTopBattlersUnweighted,
  );

  const fetchAvgRatingByCategory = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_BY_CATEGORY)
      .select("*");
    if (error) {
      console.error("Error fetching average rating by category data:", error);
    }
    if (error) throw error;
    return data as AverageRatingByCategory[];
  };

  const { data: averageRatingByCategoryData = [] } = useSWR(
    "averageRatingByCategoryData?published=true",
    fetchAvgRatingByCategory,
  );

  const fetchAvgRatingsOverTime = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_OVER_TIME)
      .select("*");
    if (error) {
      console.error("Error fetching average ratings over time data:", error);
    }
    if (error) throw error;
    return data as AvgRatingsOverTime[];
  };

  const { data: ratingsOverTimeData = [] } = useSWR(
    "ratingsOverTimeData?published=true",
    fetchAvgRatingsOverTime,
  );

  const fetchTopPositiveBadges = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_POSITIVE_BADGES).select("*");
    if (error) {
      console.error("Error fetching top positive badges:", error);
    }
    if (error) throw error;
    return data as TopBadges[];
  };

  const { data: topPositiveBadges = [] } = useSWR(
    "topPositiveBadges?published=true",
    fetchTopPositiveBadges,
  );

  const fetchTopNegativeBadges = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_NEGATIVE_BADGES).select("*");
    if (error) {
      console.error("Error fetching top negative badges:", error);
    }
    if (error) throw error;
    return data as TopBadges[];
  };

  const { data: topNegativeBadges = [] } = useSWR(
    "topNegativeBadges?published=true",
    fetchTopNegativeBadges,
  );

  const fetchRatingDistribution = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.COMMUNITY_RATING_DISTRIBUTION)
      .select("*");
    if (error) {
      console.error("Error fetching rating distribution:", error);
    }
    if (error) throw error;
    return data as RatingCommunityDistribution[];
  };

  const { data: ratingDistributionData = [] } = useSWR(
    "ratingDistributionData?published=true",
    fetchRatingDistribution,
  );

  const fetchMostValuedAttributes = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_VALUED_ATTRUBUTES)
      .select("*");
    if (error) {
      console.error("Error fetching most valued attributes:", error);
    }
    if (error) throw error;
    return data as MostValuedAttributes[];
  };

  const { data: mostValuesAttributes = [] } = useSWR(
    "mostValuesAttributes?published=true",
    fetchMostValuedAttributes,
  );

  const fetchRatingTrendByCategory = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATING_TRENDS_BY_CATEGORY)
      .select("*");
    if (error) {
      console.error("Error fetching rating trend by category:", error);
    }
    const formatData = data?.reduce((acc, curr) => {
      const month = new Date(curr.month).toLocaleString("en-US", { month: "long" });

      if (!acc[month]) {
        acc[month] = {
          [curr.category]: curr.avg_rating,
          month: month,
        };
      } else {
        acc[month][curr.category] = curr.avg_rating;
      }

      return acc;
    }, {});
    const formatDataSet = Object.values(formatData);
    if (error) throw error;
    return formatDataSet as TrendOverTimeByCategory[];
  };

  const { data: trendOverTimeByCategory = [] } = useSWR(
    "trendOverTimeByCategory?published=true",
    fetchRatingTrendByCategory,
  );

  // Fetch battler data
  const fetchBattlerData = async (query: string): Promise<Battlers[]> => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLERS)
      .select("id, name, avatar")
      .limit(10)
      .ilike("name", `%${query}%`);

    if (error) throw error;
    return data || [];
  };

  const { data: battlersData = [] } = useSWR(
    ["battlersData", searchQuery],
    () => fetchBattlerData(searchQuery),
    {
      dedupingInterval: 500,
    },
  );

  const fetchBattlerAnalyticsData = async (): Promise<{
    analytics: BattlerAnalytics[];
    totalRatings: number;
  }> => {
    const { data, error } = await supabase.from(DB_TABLES.BATTLER_ANALYTICS).select("*");

    if (error) throw error;

    const totalRatingsEntry = data?.find((item) => item.type === 1);
    const totalRatings = totalRatingsEntry?.score || 0;

    const analytics = (data || []).filter((item) => item.type === 0);

    return { analytics, totalRatings };
  };

  const { data: battlerAnalyticsData, mutate: mutateBattlerAnalytics } = useSWR(
    "battlerAnalytics",
    fetchBattlerAnalyticsData,
  );

  const fetchBattlerAnalytics = async (): Promise<void[]> => {
    await mutateBattlerAnalytics();
    return [];
  };

  return (
    <AnalyticsContext.Provider
      value={{
        battlerAnalytics: battlerAnalyticsData?.analytics || [],
        totalRatings: battlerAnalyticsData?.totalRatings || 0,
        battlersData,
        topPositiveBadges,
        topNegativeBadges,
        trendOverTimeByCategory,
        averageRatingByCategoryData,
        ratingsOverTimeData,
        ratingDistributionData,
        mostValuesAttributes,
        topBattlersUnweightedData,
        searchQuery,
        setSearchQuery,
        fetchBattlerAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider");
  }
  return context;
};
