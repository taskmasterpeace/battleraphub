"use client";

import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import debounce from "lodash.debounce";
import { BattlerAnalytics, BattlerRating, Battlers, TopAssignBadgeByBattler } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";

type BattlerBadge = {
  badge_id: number;
};

type BattlerContextType = {
  battlerBadges: BattlerBadge[];
  battlerRatings: BattlerRating[];
  battlerAnalytics: BattlerAnalytics[];
  battlersData: Battlers[];
  totalRatings: number;
  fetchBattlerAnalytics: (battlerId: string, store?: boolean) => Promise<BattlerAnalytics[]>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setBattlerRatings: React.Dispatch<React.SetStateAction<BattlerRating[]>>;
  topBadgesAssignedByBattler: TopAssignBadgeByBattler[];
  topBadgesAssignedByBattlerLoading: boolean;
};

const BattlerContext = createContext<BattlerContextType>({
  battlerBadges: [],
  battlerRatings: [],
  battlerAnalytics: [],
  battlersData: [],
  totalRatings: 0,
  fetchBattlerAnalytics: async () => [],
  searchQuery: "",
  setSearchQuery: () => {},
  setBattlerRatings: () => {},
  topBadgesAssignedByBattler: [],
  topBadgesAssignedByBattlerLoading: false,
});

export const BattlerProvider = ({ children }: { children: React.ReactNode }) => {
  const [battlerBadges, setBattlerBadges] = useState<BattlerBadge[]>([]);
  const [battlerRatings, setBattlerRatings] = useState<BattlerRating[]>([]);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [battlerAnalytics, setBattlerAnalytics] = useState<BattlerAnalytics[]>([]);
  const [battlersData, setBattlerData] = useState<Battlers[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [topBadgesAssignedByBattler, setTopBadgesAssignedByBattler] = useState<
    TopAssignBadgeByBattler[]
  >([]);
  const [topBadgesAssignedByBattlerLoading, setTopBadgesAssignedByBattlerLoading] =
    useState<boolean>(false);
  const { user } = useAuth();
  const battlerId = useParams().id;

  // Fetch battler badges
  const fetchBattlerBadges = useCallback(async () => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLER_BADGES)
      .select("badge_id")
      .eq("battler_id", battlerId);

    if (error) {
      console.error("Error fetching battler badges:", error);
    }

    if (data) {
      setBattlerBadges(data);
    }
  }, [battlerId]);

  // Fetch battler ratings
  const fetchBattlerRatings = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    const { data, error } = await supabase
      .from(DB_TABLES.BATTLER_RATINGS)
      .select("*")
      .eq("battler_id", battlerId)
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching battler ratings:", error);
    }

    if (data) {
      setBattlerRatings(data);
    }
  }, [battlerId, user?.id]);

  // Fetch battler analytics
  const fetchBattlerAnalytics = async (
    battlerId: string,
    store: boolean = true,
  ): Promise<BattlerAnalytics[]> => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLER_ANALYTICS)
      .select("*")
      .eq("battler_id", battlerId);

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

  const fetchBattlerData = useCallback(async () => {
    try {
      const { data: battlersData } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("id, name, avatar")
        .limit(10)
        .ilike("name", `%${searchQuery}%`)
        .neq("id", battlerId);

      if (battlersData) {
        setBattlerData(battlersData || []);
      }
    } catch (error) {
      console.error("Error fetching battler data:", error);
    }
  }, [searchQuery, battlerId]);

  // Fetch top badges assigned
  const fetchTopBadgesAssignedByBattlers = async (battlerId: string) => {
    setTopBadgesAssignedByBattlerLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_ASSIGNED_BADGES_BY_BATTLERS)
        .select("*")
        .eq("battler_id", battlerId);

      if (error) {
        console.error("Error fetching top badges assigned by battlers:", error);
        return;
      }
      setTopBadgesAssignedByBattler(data || []);
    } catch (error) {
      console.error("Error fetching top badges assigned by battlers:", error);
    } finally {
      setTopBadgesAssignedByBattlerLoading(false);
    }
  };

  useEffect(() => {
    fetchBattlerBadges();
  }, [fetchBattlerBadges]);

  useEffect(() => {
    fetchBattlerRatings();
  }, [fetchBattlerRatings]);

  useEffect(() => {
    fetchBattlerAnalytics(battlerId as string);
  }, [battlerId]);

  useEffect(() => {
    const debouncedFetchBattlerData = debounce(fetchBattlerData, 500);
    debouncedFetchBattlerData();
    return () => {
      debouncedFetchBattlerData.cancel();
    };
  }, [searchQuery, battlerId, fetchBattlerData]);

  useEffect(() => {
    fetchTopBadgesAssignedByBattlers(battlerId as string);
  }, [battlerId]);

  return (
    <BattlerContext.Provider
      value={{
        battlerBadges,
        battlerRatings,
        battlerAnalytics,
        totalRatings,
        battlersData,
        searchQuery,
        setSearchQuery,
        fetchBattlerAnalytics,
        setBattlerRatings,
        topBadgesAssignedByBattler,
        topBadgesAssignedByBattlerLoading,
      }}
    >
      {children}
    </BattlerContext.Provider>
  );
};

export const useBattler = () => {
  const context = useContext(BattlerContext);
  if (!context) {
    throw new Error("useBattler must be used within a BattlerProvider");
  }
  return context;
};
