"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
import debounce from "lodash.debounce";

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
  fetchBattlerAnalytics: (store?: boolean) => Promise<BattlerAnalytics[]>;
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
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [battlerAnalytics, setBattlerAnalytics] = useState<BattlerAnalytics[]>([]);
  const [topPositiveBadges, setTopPositiveBadges] = useState<TopBadges[]>([]);
  const [topNegativeBadges, setTopNegativeBadges] = useState<TopBadges[]>([]);
  const [trendOverTimeByCategory, setTrendOverTimeByCategory] = useState<TrendOverTimeByCategory[]>(
    [],
  );
  const [averageRatingByCategoryData, setAverageRatingByCategoryData] = useState<
    AverageRatingByCategory[]
  >([]);
  const [ratingsOverTimeData, setRatingsOverTimeData] = useState<AvgRatingsOverTime[]>([]);
  const [ratingDistributionData, setRatingDistributionData] = useState<
    RatingCommunityDistribution[]
  >([]);
  const [mostValuesAttributes, setMostValuesAttributes] = useState<MostValuedAttributes[]>([]);
  const [topBattlersUnweightedData, setTopBattlersUnweightedData] = useState<
    TopBattlersUnweighted[]
  >([]);
  const [battlersData, setBattlerData] = useState<Battlers[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchTopBattlersUnweighted = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.TOP_BATTLERS_UNWEIGHTED)
      .select("*");
    if (error) {
      console.error("Error fetching top battlers unweighted data:", error);
    }
    setTopBattlersUnweightedData(data || []);
  };

  const fetchAvgRatingByCategory = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_BY_CATEGORY)
      .select("*");
    if (error) {
      console.error("Error fetching average rating by category data:", error);
    }
    setAverageRatingByCategoryData(data || []);
  };

  const fetchAvgRatingsOverTime = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_OVER_TIME)
      .select("*");
    if (error) {
      console.error("Error fetching average ratings over time data:", error);
    }
    setRatingsOverTimeData(data || []);
  };

  const fetchTopPositiveBadges = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_POSITIVE_BADGES).select("*");
    if (error) {
      console.error("Error fetching top positive badges:", error);
    }
    setTopPositiveBadges(data || []);
  };

  const fetchTopNegativeBadges = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_NEGATIVE_BADGES).select("*");
    if (error) {
      console.error("Error fetching top negative badges:", error);
    }
    setTopNegativeBadges(data || []);
  };

  const fetchRatingDistribution = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.COMMUNITY_RATING_DISTRIBUTION)
      .select("*");
    if (error) {
      console.error("Error fetching rating distribution:", error);
    }
    setRatingDistributionData(data || []);
  };

  const fetchMostValuedAttributes = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_VALUED_ATTRUBUTES)
      .select("*");
    if (error) {
      console.error("Error fetching most valued attributes:", error);
    }
    setMostValuesAttributes(data || []);
  };

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
    setTrendOverTimeByCategory(Object.values(formatData));
  };

  // Fetch battler analytics
  const fetchBattlerAnalytics = async (store: boolean = true): Promise<BattlerAnalytics[]> => {
    const { data, error } = await supabase.from(DB_TABLES.BATTLER_ANALYTICS).select("*");

    if (error) {
      console.error("Error fetching battler analytics:", error);
    }

    if (data) {
      const totalRatings = data.find((item) => item.type === 1);
      setTotalRatings(totalRatings?.score || 0);
      const analytics = data.filter((item) => item.type === 0);
      if (store) {
        setBattlerAnalytics(analytics);
      }
      return analytics;
    }
    return [];
  };

  useEffect(() => {
    fetchTopBattlersUnweighted();
    fetchAvgRatingByCategory();
    fetchAvgRatingsOverTime();
    fetchTopPositiveBadges();
    fetchTopNegativeBadges();
    fetchRatingDistribution();
    fetchMostValuedAttributes();
    fetchRatingTrendByCategory();
    fetchBattlerAnalytics();
  }, []);

  const fetchBattlerData = useCallback(async () => {
    try {
      const { data: battlersData } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("id, name, avatar")
        .limit(10)
        .ilike("name", `%${searchQuery}%`);

      if (battlersData) {
        setBattlerData(battlersData || []);
      }
    } catch (error) {
      console.error("Error fetching battler data:", error);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debouncedFetchBattlerData = debounce(fetchBattlerData, 500);
    debouncedFetchBattlerData();
    return () => {
      debouncedFetchBattlerData.cancel();
    };
  }, [searchQuery, fetchBattlerData]);

  return (
    <AnalyticsContext.Provider
      value={{
        battlerAnalytics,
        totalRatings,
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
