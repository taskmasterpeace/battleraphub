"use client";

import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import useSWR from "swr";
import {
  AvgRatingsOverTime,
  Battlers,
  CommunityStatCards,
  MostAssignedBadges,
  MostValuedAttributes,
  Tags,
  TopBattlersUnweighted,
} from "@/types";

type HomeContextType = {
  recentBattlers: Battlers[];
  mostValuesAttributes: MostValuedAttributes[];
  mostAssignBadges: MostAssignedBadges[];
  communityStats: CommunityStatCards | null;
  ratingsOverTimeData: AvgRatingsOverTime[];
  topBattlersUnweightedData: TopBattlersUnweighted[];
  topBattlersWeightedData: TopBattlersUnweighted[];
  highlightBattlers: Battlers[];
  tagsData: Tags[];
  tagsLoading: boolean;
  highlightBattlerLoading: boolean;
  recentBattlerLoading: boolean;
  mostValuedAttributesLoading: boolean;
  mostAssignBadgesLoading: boolean;
  communityStatsLoading: boolean;
  avgRatingOverTimeLoading: boolean;
  battlerUnweightedLoading: boolean;
  battlerWeightedLoading: boolean;
};

const HomeContext = createContext<HomeContextType>({
  recentBattlers: [],
  mostValuesAttributes: [],
  mostAssignBadges: [],
  communityStats: null,
  ratingsOverTimeData: [],
  topBattlersUnweightedData: [],
  topBattlersWeightedData: [],
  highlightBattlers: [],
  tagsData: [],
  tagsLoading: false,
  highlightBattlerLoading: false,
  recentBattlerLoading: false,
  mostValuedAttributesLoading: false,
  mostAssignBadgesLoading: false,
  communityStatsLoading: false,
  avgRatingOverTimeLoading: false,
  battlerUnweightedLoading: false,
  battlerWeightedLoading: false,
});

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  // Fetch recent battlers
  const fetchRecentBattlers = async () => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLERS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Battlers[];
  };

  const { data: recentBattlers = [], isLoading: recentBattlerLoading } = useSWR(
    "recentBattler?published=true",
    fetchRecentBattlers,
  );

  // Fetch highlight battlers
  const fetchHighlightBattlers = async () => {
    const { data: highlightData, error: highlightError } = await supabase
      .from(DB_TABLES.HIGHLIGHTS)
      .select("*");

    if (highlightError) {
      console.error("Error fetching highlight battlers:", highlightError);
      throw highlightError;
    }

    const { data: battlerData, error: battlerError } = await supabase
      .from(DB_TABLES.BATTLERS)
      .select(
        `*, battler_tags (tags(id, name)),
            battler_analytics !inner(type, score),
            battler_badges (badges (id, name, description, is_positive, category))`,
      )
      .in("id", highlightData?.map(({ entity_id }) => entity_id) || []);

    if (battlerError) {
      console.error("Error fetching highlighted battlers:", battlerError);
      throw battlerError;
    }
    const highlightBattlersWithDetails =
      highlightData?.map(({ entity_id }) => battlerData?.find((b) => b.id === entity_id)) || [];

    return highlightBattlersWithDetails as Battlers[];
  };

  const { data: highlightBattlers = [], isLoading: highlightBattlerLoading } = useSWR(
    "highlightBattlersWithDetails?published=true",
    fetchHighlightBattlers,
  );

  //Fetch tags data
  const fetchTagsData = async () => {
    const { data, error } = await supabase.from(DB_TABLES.TAGS).select("*");
    if (error) {
      console.error("Error fetching tags:", error);
      return;
    }

    if (error) throw error;
    return data as Tags[];
  };

  const { data: tagsData = [], isLoading: tagsLoading } = useSWR(
    "tags?published=true",
    fetchTagsData,
  );

  // Fetch most valued attributes
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

  const { data: mostValuesAttributes = [], isLoading: mostValuedAttributesLoading } = useSWR(
    "mostValuedAttributes?published=true",
    fetchMostValuedAttributes,
  );

  // Fetch most assigned badges
  const fetchMostAssignBadges = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_ASSIGNED_BADGES)
      .select("*");
    if (error) {
      console.error("Error fetching most valued attributes:", error);
    }

    if (error) throw error;
    return data as MostAssignedBadges[];
  };

  const { data: mostAssignBadges = [], isLoading: mostAssignBadgesLoading } = useSWR(
    "mostAssignBadges?published=true",
    fetchMostAssignBadges,
  );

  // Fetch community stats
  const fetchCommunityStats = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
    if (error) {
      console.error("Error fetching community stats", error);
    }

    if (error) throw error;
    return data?.[0] as CommunityStatCards;
  };

  const { data: communityStats = null, isLoading: communityStatsLoading } = useSWR(
    "communityStats?published=true",
    fetchCommunityStats,
  );

  // Fetch average ratings over time
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

  const { data: ratingsOverTimeData = [], isLoading: avgRatingOverTimeLoading } = useSWR(
    "ratingsOverTimeData?published=true",
    fetchAvgRatingsOverTime,
  );

  //Fetch top battlers unweighted
  const fetchTopBattlersUnweighted = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.TOP_BATTLERS_UNWEIGHTED)
      .select("*");

    if (error) {
      console.error("Error fetching top battlers unweighted data:", error);
      return;
    }

    if (error) throw error;
    return data as TopBattlersUnweighted[];
  };

  const { data: topBattlersUnweightedData = [], isLoading: battlerUnweightedLoading } = useSWR(
    "topBattlersUnweightedData?published=true",
    fetchTopBattlersUnweighted,
  );

  //Fetch top battlers weighted
  const fetchTopBattlersWeighted = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.TOP_BATTLER_WEIGHTED)
      .select("*");

    if (error) {
      console.error("Error fetching top battlers weighted data:", error);
      return;
    }

    if (error) throw error;
    return data as TopBattlersUnweighted[];
  };

  const { data: topBattlersWeightedData = [], isLoading: battlerWeightedLoading } = useSWR(
    "topBattlersWeightedData?published=true",
    fetchTopBattlersWeighted,
  );

  return (
    <HomeContext.Provider
      value={{
        recentBattlers,
        communityStats,
        mostValuesAttributes,
        mostAssignBadges,
        recentBattlerLoading,
        mostValuedAttributesLoading,
        mostAssignBadgesLoading,
        communityStatsLoading,
        avgRatingOverTimeLoading,
        battlerUnweightedLoading,
        battlerWeightedLoading,
        ratingsOverTimeData,
        topBattlersUnweightedData,
        topBattlersWeightedData,
        highlightBattlers,
        highlightBattlerLoading,
        tagsData,
        tagsLoading,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};
