"use client";

import { MATERIALIZED_VIEWS } from "@/config";
import { supabase } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

type CommunityStats = {
  total_users: number;
  new_users_this_week: number;
  total_ratings: number;
  new_ratings_this_week: number;
  avg_rating: number;
  active_users_last_30_days: number;
};

type RatingDistribution = {
  bucket: string;
  percentage: number;
  count: number;
};

type ActiveRolesByRatings = {
  role_id: number;
  rating_count: number;
  percentage: number;
};

type LeaderboardContextType = {
  communityStats: CommunityStats | null;
  ratingDistribution: RatingDistribution[] | null;
  activeRolesByRatings: ActiveRolesByRatings[] | null;
  communityLoading: boolean;
  ratingDistributionLoading: boolean;
  activeRolesByRatingLoading: boolean;
};

const LeaderboardContext = createContext<LeaderboardContextType>({
  communityStats: null,
  ratingDistribution: null,
  activeRolesByRatings: null,
  communityLoading: false,
  ratingDistributionLoading: false,
  activeRolesByRatingLoading: false,
});

export const LeaderboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[] | null>(null);
  const [communityLoading, setCommunityLoading] = useState<boolean>(false);
  const [ratingDistributionLoading, setRatingDistributionLoading] = useState<boolean>(false);
  const [activeRolesByRatingLoading, setActiveRolesByRatingsLoading] = useState<boolean>(false);
  const [activeRolesByRatings, setActiveRolesByRatings] = useState<ActiveRolesByRatings[] | null>(
    null,
  );
  const fetchCommunityStats = async () => {
    setCommunityLoading(true);
    try {
      const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
      if (error) {
        console.error("Error fetching community stats", error);
      }
      setCommunityStats(data?.[0] as CommunityStats);
    } catch (error) {
      console.error("Error fetching community stats", error);
    } finally {
      setCommunityLoading(false);
    }
  };

  const fetchRatingDistribution = async () => {
    setRatingDistributionLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.RATING_DISTRIBUTION)
        .select("*");
      if (error) {
        console.error("Error fetching rating distribution", error);
      }
      setRatingDistribution(data as RatingDistribution[]);
    } catch (error) {
      console.error("Error fetching rating distribution", error);
    } finally {
      setRatingDistributionLoading(false);
    }
  };

  const fetchActiveRolesByRatings = async () => {
    setActiveRolesByRatingsLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.ACTIVE_ROLES_BY_RATINGS)
        .select("*");
      if (error) {
        console.error("Error fetching active roles by ratings", error);
      }
      setActiveRolesByRatings(data as ActiveRolesByRatings[]);
    } catch (error) {
      console.error("Error fetching active roles by ratings", error);
    } finally {
      setActiveRolesByRatingsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityStats();
    fetchRatingDistribution();
    fetchActiveRolesByRatings();
  }, []);

  return (
    <LeaderboardContext.Provider
      value={{
        communityStats,
        communityLoading,
        ratingDistributionLoading,
        ratingDistribution,
        activeRolesByRatingLoading,
        activeRolesByRatings,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
