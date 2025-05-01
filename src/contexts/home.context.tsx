"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import {
  AvgRatingsOverTime,
  Battlers,
  CommunityStatCards,
  MostAssignedBadges,
  MostValuedAttributes,
  TopBattlersUnweighted,
} from "@/types";

type HomeContextType = {
  recentBattlers: Battlers[];
  mostValuesAttributes: MostValuedAttributes[];
  mostAssignBadges: MostAssignedBadges[];
  communityStats: CommunityStatCards | null;
  ratingsOverTimeData: AvgRatingsOverTime[];
  topBattlersUnweightedData: TopBattlersUnweighted[];
};

const HomeContext = createContext<HomeContextType>({
  recentBattlers: [],
  mostValuesAttributes: [],
  mostAssignBadges: [],
  communityStats: null,
  ratingsOverTimeData: [],
  topBattlersUnweightedData: [],
});

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [recentBattlers, setRecentBattlers] = useState<Battlers[]>([]);
  const [mostValuesAttributes, setMostValuesAttributes] = useState<MostValuedAttributes[]>([]);
  const [mostAssignBadges, setMostAssignBadges] = useState<MostAssignedBadges[]>([]);
  const [ratingsOverTimeData, setRatingsOverTimeData] = useState<AvgRatingsOverTime[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStatCards | null>(null);
  const [topBattlersUnweightedData, setTopBattlersUnweightedData] = useState<
    TopBattlersUnweighted[]
  >([]);

  // Fetch recent battlers
  const fetchRecentBattlers = async () => {
    try {
      const { data: recentBattlersData, error } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching recent battlers:", error);
      }
      if (recentBattlersData) {
        setRecentBattlers(recentBattlersData || []);
      }
    } catch (error) {
      console.error("Error fetching recent battlers:", error);
    }
  };

  // Fetch most valued attributes
  const fetchMostValuedAttributes = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_VALUED_ATTRUBUTES)
      .select("*");
    if (error) {
      console.error("Error fetching most valued attributes:", error);
    }
    setMostValuesAttributes(data || []);
  };

  // Fetch most assigned badges
  const fetchMostAssignBadges = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_ASSIGNED_BADGES)
      .select("*");
    if (error) {
      console.error("Error fetching most valued attributes:", error);
    }
    setMostAssignBadges(data || []);
  };

  // Fetch community stats
  const fetchCommunityStats = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
    if (error) {
      console.error("Error fetching community stats", error);
    }
    setCommunityStats(data?.[0] as CommunityStatCards);
  };

  // Fetch average ratings over time
  const fetchAvgRatingsOverTime = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_OVER_TIME)
      .select("*");
    if (error) {
      console.error("Error fetching average ratings over time data:", error);
    }
    setRatingsOverTimeData(data || []);
  };

  //Fetch top battlers
  const fetchTopBattlersUnweighted = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.TOP_BATTLERS_UNWEIGHTED)
      .select("*");

    if (error) {
      console.error("Error fetching top battlers unweighted data:", error);
      return;
    }

    setTopBattlersUnweightedData(data || []);
  };
  useEffect(() => {
    fetchRecentBattlers();
    fetchMostValuedAttributes();
    fetchMostAssignBadges();
    fetchCommunityStats();
    fetchAvgRatingsOverTime();
    fetchTopBattlersUnweighted();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        recentBattlers,
        communityStats,
        mostValuesAttributes,
        mostAssignBadges,
        ratingsOverTimeData,
        topBattlersUnweightedData,
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
