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
  Tags,
  TopAssignBadgeByBattler,
  TopBattlersUnweighted,
} from "@/types";
import { useParams } from "next/navigation";
import { useFormSubmit } from "@/hooks/useFormSubmit";

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
  topBadgesAssignedByBattler: TopAssignBadgeByBattler[];
  fetchTopBadgesAssignedByBattlers: (params: { battlerId: string }) => Promise<void>;
  topBadgesAssignedByBattlerLoading: boolean;
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
  topBadgesAssignedByBattler: [],
  fetchTopBadgesAssignedByBattlers: async () => {},
  topBadgesAssignedByBattlerLoading: false,
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
  const battlerId = useParams().id;
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
  const [highlightBattlers, setHighlightBattlers] = useState<Battlers[]>([]);
  const [tagsData, setTagsData] = useState<Tags[]>([]);
  const [topBadgesAssignedByBattler, setTopBadgesAssignedByBattler] = useState<
    TopAssignBadgeByBattler[]
  >([]);

  // Fetch recent battlers
  const { onSubmit: fetchRecentBattlers, processing: recentBattlerLoading } = useFormSubmit(
    async () => {
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
    },
  );

  // Fetch highlight battlers
  const { onSubmit: fetchHighlightBattlers, processing: highlightBattlerLoading } = useFormSubmit(
    async () => {
      try {
        const { data: highlightData, error: highlightError } = await supabase
          .from(DB_TABLES.HIGHLIGHTS)
          .select("*");

        if (highlightError) {
          console.error("Error fetching highlight battlers:", highlightError);
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
        }
        const highlightBattlersWithDetails =
          highlightData?.map(({ entity_id }) => battlerData?.find((b) => b.id === entity_id)) || [];

        setHighlightBattlers(highlightBattlersWithDetails);
      } catch (error) {
        console.error("Error fetching highlighted battlers:", error);
      }
    },
  );

  //Fetch tags data
  const { onSubmit: fetchTagsData, processing: tagsLoading } = useFormSubmit(async () => {
    try {
      const { data, error } = await supabase.from(DB_TABLES.TAGS).select("*");
      if (error) {
        console.error("Error fetching tags:", error);
        return;
      }
      setTagsData(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  });

  // Fetch most valued attributes
  const { onSubmit: fetchMostValuedAttributes, processing: mostValuedAttributesLoading } =
    useFormSubmit(async () => {
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
      }
    });

  // Fetch most assigned badges
  const { onSubmit: fetchMostAssignBadges, processing: mostAssignBadgesLoading } = useFormSubmit(
    async () => {
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
      }
    },
  );

  // Fetch community stats
  const { onSubmit: fetchCommunityStats, processing: communityStatsLoading } = useFormSubmit(
    async () => {
      try {
        const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
        if (error) {
          console.error("Error fetching community stats", error);
        }
        setCommunityStats(data?.[0] as CommunityStatCards);
      } catch (error) {
        console.error("Error fetching community stats", error);
      }
    },
  );

  // Fetch average ratings over time
  const { onSubmit: fetchAvgRatingsOverTime, processing: avgRatingOverTimeLoading } = useFormSubmit(
    async () => {
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
      }
    },
  );

  //Fetch top battlers unweighted
  const { onSubmit: fetchTopBattlersUnweighted, processing: battlerUnweightedLoading } =
    useFormSubmit(async () => {
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
      }
    });

  //Fetch top battlers weighted
  const { onSubmit: fetchTopBattlersWeighted, processing: topBadgesAssignedByBattlerLoading } =
    useFormSubmit(async () => {
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
      }
    });

  // Fetch top badges assigned by battlers
  const { onSubmit: fetchTopBadgesAssignedByBattlers, processing: battlerWeightedLoading } =
    useFormSubmit(async ({ battlerId }: { battlerId: string }) => {
      try {
        if (!battlerId || battlerId.trim() === "") {
          console.warn(
            "fetchTopBadgesAssignedByBattlers called with invalid battlerId:",
            battlerId,
          );
          return;
        }

        const { data, error } = await supabase
          .from(MATERIALIZED_VIEWS.TOP_ASSIGNED_BADGES_BY_BATTLERS)
          .select("*")
          .eq("battler_id", battlerId);

        if (error) {
          console.error("Error fetching top badges assigned by battlers", error);
          return;
        }
        setTopBadgesAssignedByBattler(data as TopAssignBadgeByBattler[]);
      } catch (err) {
        console.error("Unexpected error fetching top badges assigned by battlers:", err);
      }
    });

  useEffect(() => {
    fetchRecentBattlers();
    fetchMostValuedAttributes();
    fetchMostAssignBadges();
    fetchCommunityStats();
    fetchAvgRatingsOverTime();
    fetchTopBattlersUnweighted();
    fetchTopBattlersWeighted();
    fetchHighlightBattlers();
    fetchTagsData();
  }, []);

  useEffect(() => {
    if (battlerId) {
      fetchTopBadgesAssignedByBattlers({ battlerId: battlerId as string });
    }
  }, [battlerId, fetchTopBadgesAssignedByBattlers]);

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
        topBadgesAssignedByBattler,
        topBadgesAssignedByBattlerLoading,
        fetchTopBadgesAssignedByBattlers,
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
