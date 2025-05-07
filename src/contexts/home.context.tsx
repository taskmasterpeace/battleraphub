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
  topBattlersWeightedData: TopBattlersUnweighted[];
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
  recentBattlerLoading: false,
  mostValuedAttributesLoading: false,
  mostAssignBadgesLoading: false,
  communityStatsLoading: false,
  avgRatingOverTimeLoading: false,
  battlerUnweightedLoading: false,
  battlerWeightedLoading: false,
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
  const [topBattlersWeightedData, setTopBattlersWeightedData] = useState<TopBattlersUnweighted[]>(
    [],
  );
  const [recentBattlerLoading, setRecentBattlerLoading] = useState<boolean>(false);
  const [mostValuedAttributesLoading, setMostValuedAttributesLoading] = useState<boolean>(false);
  const [mostAssignBadgesLoading, setMostAssignBadgesLoading] = useState<boolean>(false);
  const [communityStatsLoading, setCommunityStatsLoading] = useState<boolean>(false);
  const [avgRatingOverTimeLoading, setAvgRatingOverTimeLoading] = useState<boolean>(false);
  const [battlerUnweightedLoading, setBattlerUnweightedLoading] = useState<boolean>(false);
  const [battlerWeightedLoading, setBattlerWeightedLoading] = useState<boolean>(false);
  // Fetch recent battlers
  const fetchRecentBattlers = async () => {
    setRecentBattlerLoading(true);
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
    } finally {
      setRecentBattlerLoading(false);
    }
  };

  // Fetch most valued attributes
  const fetchMostValuedAttributes = async () => {
    setMostValuedAttributesLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.MOST_VALUED_ATTRUBUTES)
        .select("*");
      if (error) {
        console.error("Error fetching most valued attributes:", error);
      }
      setMostValuesAttributes(data || []);
    } catch (error) {
      console.error("Error fetching most valued attributes:", error);
    } finally {
      setMostValuedAttributesLoading(false);
    }
  };

  // Fetch most assigned badges
  const fetchMostAssignBadges = async () => {
    setMostAssignBadgesLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.MOST_ASSIGNED_BADGES)
        .select("*");
      if (error) {
        console.error("Error fetching most valued attributes:", error);
      }
      setMostAssignBadges(data || []);
    } catch (error) {
      console.error("Error fetching most valued attributes:", error);
    } finally {
      setMostAssignBadgesLoading(false);
    }
  };

  // Fetch community stats
  const fetchCommunityStats = async () => {
    setCommunityStatsLoading(true);
    try {
      const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
      if (error) {
        console.error("Error fetching community stats", error);
      }
      setCommunityStats(data?.[0] as CommunityStatCards);
    } catch (error) {
      console.error("Error fetching community stats", error);
    } finally {
      setCommunityStatsLoading(false);
    }
  };

  // Fetch average ratings over time
  const fetchAvgRatingsOverTime = async () => {
    setAvgRatingOverTimeLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.AVERAGE_RATINGS_OVER_TIME)
        .select("*");
      if (error) {
        console.error("Error fetching average ratings over time data:", error);
      }
      setRatingsOverTimeData(data || []);
    } catch (error) {
      console.error("Error fetching average ratings over time data:", error);
    } finally {
      setAvgRatingOverTimeLoading(false);
    }
  };

  //Fetch top battlers unweighted
  const fetchTopBattlersUnweighted = async () => {
    setBattlerUnweightedLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_BATTLERS_UNWEIGHTED)
        .select("*");

      if (error) {
        console.error("Error fetching top battlers unweighted data:", error);
        return;
      }

      setTopBattlersUnweightedData(data || []);
    } catch (error) {
      console.error("Error fetching top battlers unweighted data:", error);
    } finally {
      setBattlerUnweightedLoading(false);
    }
  };

  //Fetch top battlers weighted
  const fetchTopBattlersWeighted = async () => {
    setBattlerWeightedLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_BATTLER_WEIGHTED)
        .select("*");

      if (error) {
        console.error("Error fetching top battlers weighted data:", error);
        return;
      }

      setTopBattlersWeightedData(data || []);
    } catch (error) {
      console.error("Error fetching top battlers weighted:", error);
    } finally {
      setBattlerWeightedLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBattlers();
    fetchMostValuedAttributes();
    fetchMostAssignBadges();
    fetchCommunityStats();
    fetchAvgRatingsOverTime();
    fetchTopBattlersUnweighted();
    fetchTopBattlersWeighted();
  }, []);

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
