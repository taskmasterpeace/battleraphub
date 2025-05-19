"use client";

import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import { BattlerAnalytics, BattlerRating, Battlers, TopAssignBadgeByBattler } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import useSWR from "swr";

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
  const [battlerRatings, setBattlerRatings] = useState<BattlerRating[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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

    if (error) throw error;
    return data as BattlerBadge[];
  }, [battlerId]);

  const { data: battlerBadges = [] } = useSWR("battlerBadges?published=true", fetchBattlerBadges);

  const fetchBattlerAnalytics = async (battlerId: string) => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLER_ANALYTICS)
      .select("*")
      .eq("battler_id", battlerId);

    if (error) throw error;
    return data as BattlerAnalytics[];
  };

  const { data: allBattlerAnalytics = [] } = useSWR(
    battlerId ? `battlerAnalytics/${battlerId}` : null,
    () => fetchBattlerAnalytics(battlerId as string),
  );

  const battlerAnalytics = allBattlerAnalytics.filter((item) => item.type === 0);
  const totalRatings = allBattlerAnalytics.find((item) => item.type === 1)?.score || 0;

  // Fetch battler data
  const { data: battlersData = [] } = useSWR(
    `battlersData?query=${searchQuery || ""}`,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("id, name, avatar")
        .limit(10)
        .ilike("name", `%${searchQuery}%`)
        .neq("id", battlerId);

      if (error) throw error;
      return data as Battlers[];
    },
  );

  const { data: topBadgesAssignedByBattler = [], isLoading: topBadgesAssignedByBattlerLoading } =
    useSWR(battlerId ? `topBadgesAssignedByBattler/${battlerId}` : null, async () => {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_ASSIGNED_BADGES_BY_BATTLERS)
        .select("*")
        .eq("battler_id", battlerId);

      if (error) throw error;
      return data as TopAssignBadgeByBattler[];
    });

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

  useEffect(() => {
    fetchBattlerRatings();
  }, [fetchBattlerRatings]);

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
