"use client";

import { MATERIALIZED_VIEWS } from "@/config";
import {
  ActiveRolesByRatings,
  CommunityStats,
  MostAccurateUsers,
  MostConsistentUsers,
  MostInfluentialUsers,
  RatingDistribution,
  TopRaterBattler,
} from "@/types";
import { supabase } from "@/utils/supabase/client";
import { createContext, useContext } from "react";
import useSWR from "swr";

type LeaderboardContextType = {
  communityStats: CommunityStats | null;
  ratingDistribution: RatingDistribution[] | null;
  activeRolesByRatings: ActiveRolesByRatings[] | null;
  communityLoading: boolean;
  ratingDistributionLoading: boolean;
  activeRolesByRatingLoading: boolean;
  topRaterBattlerLoading: boolean;
  topRatersBattler: TopRaterBattler[];
  mostInfluentialUsers: MostInfluentialUsers[];
  mostInfluentialUsersLoading: boolean;
  mostConsistentUsers: MostConsistentUsers[];
  mostConsistentUsersLoading: boolean;
  mostAccurateUsers: MostAccurateUsers[];
  mostAccurateUsersLoading: boolean;
};

const LeaderboardContext = createContext<LeaderboardContextType>({
  communityStats: null,
  ratingDistribution: null,
  activeRolesByRatings: null,
  communityLoading: false,
  ratingDistributionLoading: false,
  activeRolesByRatingLoading: false,
  topRaterBattlerLoading: false,
  topRatersBattler: [],
  mostInfluentialUsers: [],
  mostInfluentialUsersLoading: false,
  mostConsistentUsers: [],
  mostConsistentUsersLoading: false,
  mostAccurateUsers: [],
  mostAccurateUsersLoading: false,
});

export const LeaderboardProvider = ({ children }: { children: React.ReactNode }) => {
  // Fetch community stats
  const fetchCommunityStats = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
    if (error) {
      console.error("Error fetching community stats", error);
    }

    if (error) throw error;
    return data?.[0] as CommunityStats;
  };

  const { data: communityStats = null, isLoading: communityLoading } = useSWR(
    "communityStats?published=true",
    fetchCommunityStats,
  );

  // Fetch rating distribution
  const fetchRatingDistribution = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.RATING_DISTRIBUTION).select("*");
    if (error) {
      console.error("Error fetching rating distribution", error);
    }

    if (error) throw error;
    return data as RatingDistribution[];
  };

  const { data: ratingDistribution = null, isLoading: ratingDistributionLoading } = useSWR(
    "ratingDistribution?published=true",
    fetchRatingDistribution,
  );

  // Fetch active roles by ratings
  const fetchActiveRolesByRatings = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.ACTIVE_ROLES_BY_RATINGS)
      .select("*");
    if (error) {
      console.error("Error fetching active roles by ratings", error);
    }

    if (error) throw error;
    return data as ActiveRolesByRatings[];
  };

  const { data: activeRolesByRatings = null, isLoading: activeRolesByRatingLoading } = useSWR(
    "activeRolesByRatings?published=true",
    fetchActiveRolesByRatings,
  );

  // Fetch top rater battlers
  const fetchTopRaterBattlers = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_RATERS).select("*");
    if (error) {
      console.error("Error fetching top rater battlers", error);
    }

    if (error) throw error;
    return data as TopRaterBattler[];
  };

  const { data: topRatersBattler = [], isLoading: topRaterBattlerLoading } = useSWR(
    "topRatersBattler?published=true",
    fetchTopRaterBattlers,
  );

  // Fetch most consistent users
  const fetchMostConsistentUsers = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_CONSISTENT_USERS)
      .select("*");
    if (error) {
      console.error("Error fetching most consistent users", error);
    }

    if (error) throw error;
    return data as MostConsistentUsers[];
  };

  const { data: mostConsistentUsers = [], isLoading: mostConsistentUsersLoading } = useSWR(
    "mostConsistentUsers?published=true",
    fetchMostConsistentUsers,
  );

  // Fetch most influenced users
  const fetchMostInfluentialUsers = async () => {
    const { data, error } = await supabase
      .from(MATERIALIZED_VIEWS.MOST_INFLUENCED_USERS)
      .select("*");
    if (error) {
      console.error("Error fetching most influential users", error);
    }

    if (error) throw error;
    return data as MostInfluentialUsers[];
  };

  const { data: mostInfluentialUsers = [], isLoading: mostInfluentialUsersLoading } = useSWR(
    "mostInfluentialUsers?published=true",
    fetchMostInfluentialUsers,
  );

  // Fetch most accurate users
  const fetchMostAccurateUsers = async () => {
    const { data, error } = await supabase.from(MATERIALIZED_VIEWS.MOST_ACCURATE_USERS).select("*");
    if (error) {
      console.error("Error fetching most accurate users", error);
    }

    if (error) throw error;
    return data as MostAccurateUsers[];
  };

  const { data: mostAccurateUsers = [], isLoading: mostAccurateUsersLoading } = useSWR(
    "mostAccurateUsers?published=true",
    fetchMostAccurateUsers,
  );

  return (
    <LeaderboardContext.Provider
      value={{
        communityStats,
        communityLoading,
        ratingDistributionLoading,
        ratingDistribution,
        activeRolesByRatingLoading,
        activeRolesByRatings,
        topRatersBattler,
        topRaterBattlerLoading,
        mostInfluentialUsers,
        mostInfluentialUsersLoading,
        mostConsistentUsers,
        mostConsistentUsersLoading,
        mostAccurateUsers,
        mostAccurateUsersLoading,
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
