"use client";

import { DB_TABLES, MATERIALIZED_VIEWS } from "@/config";
import {
  Attribute,
  Badge,
  BattlerAnalytics,
  BattlerRating,
  Battlers,
  Category,
  TopAssignBadgeByBattler,
} from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth.context";
import useSWR from "swr";
import { toast } from "sonner";

type BattlerBadge = {
  badge_id: number;
};

type ChartType = {
  writing: "radar" | "bar";
  performance: "radar" | "bar";
  personal: "radar" | "bar";
};

type SelectedBadges = {
  positive: string[];
  negative: string[];
};

type RatingsMap = Record<string, { id: string; score: number }>;

type BattlerContextType = {
  battlerBadges: BattlerBadge[];
  battlerRatings: BattlerRating[];
  battlerAnalytics: BattlerAnalytics[];
  battlersData: Battlers[];
  totalRatings: number;
  topBadgesAssignedByBattler: TopAssignBadgeByBattler[];
  topBadgesAssignedByBattlerLoading: boolean;
  battlerData: Battlers | null;
  searchQuery: string;
  chartType: ChartType;
  selectedBadges: SelectedBadges;
  ratings: RatingsMap;
  selectedBattler: Battlers | null;
  badges: Badge[];
  attributes: Attribute[];
  selectedBattlerAnalytics: BattlerAnalytics[];
  selectedBattlerTotalRatings: number;
  setSearchQuery: (query: string) => void;
  fetchBattlerAnalytics: (battlerId: string, store?: boolean) => Promise<BattlerAnalytics[]>;
  toggleChartType: (section: Category) => void;
  handleRatingChange: (attributeId: number, value: number) => Promise<void>;
  handleBadgeSelect: (badge: string, isPositive: boolean) => Promise<void>;
  setSelectedBattler: (battler: Battlers | null) => void;
};

const BattlerContext = createContext<BattlerContextType>({
  battlerBadges: [],
  battlerRatings: [],
  battlerAnalytics: [],
  battlersData: [],
  totalRatings: 0,
  topBadgesAssignedByBattler: [],
  topBadgesAssignedByBattlerLoading: false,
  battlerData: null,
  badges: [],
  attributes: [],
  selectedBattlerAnalytics: [],
  selectedBattlerTotalRatings: 0,
  searchQuery: "",
  chartType: { writing: "radar", performance: "radar", personal: "radar" },
  selectedBadges: { positive: [], negative: [] },
  ratings: {},
  selectedBattler: null,

  setSearchQuery: () => {},
  fetchBattlerAnalytics: async () => [],
  toggleChartType: () => {},
  handleRatingChange: async () => {},
  handleBadgeSelect: async () => {},
  setSelectedBattler: () => {},
});

export const BattlerProvider = ({
  children,
  badgeData,
  attributeData,
}: {
  children: React.ReactNode;
  badgeData: Badge[];
  attributeData: Attribute[];
}) => {
  // Core state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBattler, setSelectedBattler] = useState<Battlers | null>(null);
  const [chartType, setChartType] = useState<ChartType>({
    writing: "radar",
    performance: "radar",
    personal: "radar",
  });
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({
    positive: [],
    negative: [],
  });
  const [ratings, setRatings] = useState<RatingsMap>({});

  const { user } = useAuth();
  const battlerId = useParams().id;
  const userId = user?.id;

  // List of badges assigned to battler
  const { data: battlerBadges = [] } = useSWR(
    battlerId && userId ? `battlerBadges/${battlerId}/${userId}` : null,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLER_BADGES)
        .select("badge_id")
        .eq("battler_id", battlerId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching battler badges:", error);
      }

      if (error) throw error;
      return data as BattlerBadge[];
    },
    {
      onError: (error) => {
        console.error("Error fetching battler badges:", error);
        toast.error("Failed to fetch battler badges");
      },
    },
  );

  const fetchBattlerAnalytics = async (battlerId: string) => {
    const { data, error } = await supabase
      .from(DB_TABLES.BATTLER_ANALYTICS)
      .select("*")
      .eq("battler_id", battlerId);

    if (error) throw error;
    return data as BattlerAnalytics[];
  };

  // Battler analytics data
  const { data: allBattlerAnalytics = [] } = useSWR(
    battlerId ? `battlerAnalytics/${battlerId}` : null,
    () => fetchBattlerAnalytics(battlerId as string),
  );

  // Attributes analytics data
  const battlerAnalytics = useMemo(() => {
    return allBattlerAnalytics.filter((item) => item.type === 0);
  }, [allBattlerAnalytics]);

  // Total ratings
  const totalRatings = useMemo(() => {
    return allBattlerAnalytics.find((item) => item.type === 1)?.score || 0;
  }, [allBattlerAnalytics]);

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

  // Top badges assigned to battler
  const { data: topBadgesAssignedByBattler = [], isLoading: topBadgesAssignedByBattlerLoading } =
    useSWR(battlerId ? `topBadgesAssignedByBattler/${battlerId}` : null, async () => {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_ASSIGNED_BADGES_BY_BATTLERS)
        .select("*")
        .eq("battler_id", battlerId);

      if (error) throw error;
      return data as TopAssignBadgeByBattler[];
    });

  // Battler ratings for each attribute given by user
  const { data: battlerRatings = [], mutate: updateBattlerRating } = useSWR(
    battlerId && user?.id ? `battlerRatings/${battlerId}/${user?.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLER_RATINGS)
        .select("*")
        .eq("battler_id", battlerId)
        .eq("user_id", user?.id);

      if (error) throw error;
      return data as BattlerRating[];
    },
    {
      onError: (error) => {
        console.error("Error fetching battler ratings:", error);
        toast.error("Failed to fetch battler ratings");
      },
    },
  );

  // Battler details
  const { data: battlerData = null } = useSWR(
    battlerId ? `battlerData/${battlerId}` : null,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select(
          `*, 
          users !added_by (
            role_id
          ),
          battler_tags (
            tags (
              id,
              name
            )
          )
        `,
        )
        .eq("id", battlerId)
        .eq("battler_tags.battler_id", battlerId);

      if (error) throw error;
      if (!data?.length) {
        throw new Error("Battler not found");
      }
      return data[0] as Battlers;
    },
    {
      onError: (error) => {
        console.error("Error fetching battler details:", error);
        toast.error("Failed to fetch battler details");
      },
    },
  );

  // Handle rating changes
  const handleRatingChange = async (attributeId: number, value: number) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLER_RATINGS)
        .upsert(
          {
            user_id: userId,
            battler_id: battlerId,
            attribute_id: attributeId,
            score: value,
          },
          {
            onConflict: "user_id,battler_id,attribute_id",
          },
        )
        .select();

      if (error || !data || data.length === 0) {
        console.error("Error saving rating", error);
        toast.error("Error saving rating");
        return;
      }

      const newRating = data[0];
      // Update ratings
      setRatings((prev) => ({
        ...prev,
        [attributeId]: {
          id: newRating.id,
          score: newRating.score,
        },
      }));

      // Mutate locally
      const newBattlerRatingsData = [...battlerRatings];
      const index = newBattlerRatingsData.findIndex((r) => r.attribute_id === attributeId);
      if (index !== -1) {
        newBattlerRatingsData[index] = {
          ...newRating,
          updated_at: new Date().toISOString(),
        };
      } else {
        newBattlerRatingsData.push({
          ...newRating,
          updated_at: new Date().toISOString(),
        });
      }
      updateBattlerRating(newBattlerRatingsData);
    } catch (err) {
      console.error("Error saving rating:", err);
      toast.error("Failed to save rating");
    }
  };

  // Handle badge selection
  const handleBadgeSelect = async (badge: string, isPositive: boolean) => {
    if (!userId) return;

    try {
      const badgeType = isPositive ? "positive" : "negative";
      const isSelected = selectedBadges[badgeType].includes(badge);

      // Find badge ID
      const badgeObj = badgeData.find((b) => b.name === badge && b.is_positive === isPositive);

      if (!badgeObj) {
        toast.error("Badge not found");
        return;
      }

      if (isSelected) {
        // Remove badge
        const { error } = await supabase
          .from(DB_TABLES.BATTLER_BADGES)
          .delete()
          .eq("user_id", userId)
          .eq("battler_id", battlerId)
          .eq("badge_id", badgeObj.id);

        if (error) {
          toast.error("Error removing badge");
          return;
        }

        // Update local state
        setSelectedBadges((prev) => ({
          ...prev,
          [badgeType]: prev[badgeType].filter((b) => b !== badge),
        }));

        toast.success("Badge removed successfully");
      } else {
        // Add badge
        const { error } = await supabase.from(DB_TABLES.BATTLER_BADGES).insert({
          user_id: userId,
          battler_id: battlerId,
          badge_id: badgeObj.id,
        });

        if (error) {
          toast.error("Error adding badge");
          return;
        }

        // Update local state
        setSelectedBadges((prev) => ({
          ...prev,
          [badgeType]: [...prev[badgeType], badge],
        }));

        toast.success("Badge added successfully");
      }
    } catch (error) {
      console.error("Error handling badge selection:", error);
      toast.error("Failed to update badge");
    }
  };

  // Toggle chart type
  const toggleChartType = useCallback((section: Category) => {
    setChartType((prev) => ({
      ...prev,
      [section]: prev[section] === "radar" ? "bar" : "radar",
    }));
  }, []);

  const { data: selectedBattlerAnalyticsData = [] } = useSWR(
    selectedBattler ? `battler-analytics-${selectedBattler.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from(DB_TABLES.BATTLER_ANALYTICS)
        .select("*")
        .eq("battler_id", selectedBattler?.id);

      if (error) {
        throw error;
      }
      return data as BattlerAnalytics[];
    },
    {
      onError: (error) => {
        console.error("Error fetching comparison battler ratings:", error);
        toast.error("Failed to fetch comparison battler ratings");
      },
    },
  );

  const selectedBattlerAnalytics = useMemo(() => {
    return selectedBattlerAnalyticsData.filter((item) => item.type === 0);
  }, [selectedBattlerAnalyticsData]);

  const selectedBattlerTotalRatings = useMemo(() => {
    return selectedBattlerAnalyticsData.find((item) => item.type === 1)?.score || 0;
  }, [selectedBattlerAnalyticsData]);

  // Update ratings when battlerRatings or battlerAnalytics change
  useEffect(() => {
    if (battlerRatings.length || battlerAnalytics.length) {
      const ratingMap: Record<string, { id: string; score: number }> = {};
      const ratingsData = userId ? battlerRatings : battlerAnalytics;
      ratingsData.forEach((rating) => {
        ratingMap[rating.attribute_id] = { id: rating.id, score: Number(rating.score) };
      });
      setRatings(ratingMap);
    }
  }, [JSON.stringify(battlerRatings), JSON.stringify(battlerAnalytics), userId]);

  // Update selected badges when battlerBadges or topBadgesAssignedByBattler change
  useEffect(() => {
    // Only update if we have the necessary data to prevent unnecessary renders
    if (userId && battlerBadges.length > 0 && badgeData.length > 0) {
      const badgeIds = battlerBadges.map((bb) => bb.badge_id);
      const allBadges = [...badgeData];
      const filterBadgeData = allBadges.filter((badge) => badgeIds.includes(badge.id));

      if (filterBadgeData.length) {
        const positive = filterBadgeData.filter((b) => b.is_positive).map((b) => b.name);
        const negative = filterBadgeData.filter((b) => !b.is_positive).map((b) => b.name);
        setSelectedBadges({ positive, negative });
      }
    } else if (!userId && topBadgesAssignedByBattler.length > 0 && battlerId) {
      const positive = topBadgesAssignedByBattler
        .filter((b) => b.is_positive && b.battler_id === battlerId)
        .map((b) => b.badge_name);
      const negative = topBadgesAssignedByBattler
        .filter((b) => !b.is_positive && b.battler_id === battlerId)
        .map((b) => b.badge_name);
      setSelectedBadges({ positive, negative });
    }
    // We need to carefully manage this dependency array to prevent infinite loops
  }, [
    JSON.stringify(battlerBadges),
    userId,
    JSON.stringify(topBadgesAssignedByBattler),
    battlerId,
    JSON.stringify(badgeData),
  ]);

  return (
    <BattlerContext.Provider
      value={{
        battlerBadges,
        battlerRatings,
        battlerAnalytics,
        totalRatings,
        battlersData,
        topBadgesAssignedByBattler,
        topBadgesAssignedByBattlerLoading,
        battlerData,
        selectedBattlerAnalytics,
        selectedBattlerTotalRatings,
        searchQuery,
        chartType,
        selectedBadges,
        ratings,
        selectedBattler,
        badges: badgeData,
        attributes: attributeData,
        setSearchQuery,
        fetchBattlerAnalytics,
        toggleChartType,
        handleRatingChange,
        handleBadgeSelect,
        setSelectedBattler,
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
