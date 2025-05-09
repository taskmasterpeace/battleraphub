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
import { createContext, useContext, useEffect, useState } from "react";

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
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[] | null>(null);
  const [communityLoading, setCommunityLoading] = useState<boolean>(false);
  const [ratingDistributionLoading, setRatingDistributionLoading] = useState<boolean>(false);
  const [activeRolesByRatingLoading, setActiveRolesByRatingsLoading] = useState<boolean>(false);
  const [activeRolesByRatings, setActiveRolesByRatings] = useState<ActiveRolesByRatings[] | null>(
    null,
  );
  const [topRatersBattler, setTopRatersBattler] = useState<TopRaterBattler[]>([]);
  const [topRaterBattlerLoading, setTopRaterBattlerLoading] = useState<boolean>(false);
  const [mostConsistentUsers, setMostConsistentUsers] = useState<MostConsistentUsers[]>([]);
  const [mostConsistentUsersLoading, setMostConsistentUsersLoading] = useState<boolean>(false);
  const [mostInfluentialUsers, setMostInfluentialUsers] = useState<MostInfluentialUsers[]>([]);
  const [mostInfluentialUsersLoading, setMostInfluentialUsersLoading] = useState<boolean>(false);
  const [mostAccurateUsers, setMostAccurateUsers] = useState<MostAccurateUsers[]>([]);
  const [mostAccurateUsersLoading, setMostAccurateUsersLoading] = useState<boolean>(false);

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

  const fetchTopRaterBattlers = async () => {
    setTopRaterBattlerLoading(true);
    try {
      const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_RATERS).select("*");
      if (error) {
        console.error("Error fetching top rater battlers", error);
      }
      setTopRatersBattler(data as TopRaterBattler[]);
    } catch (error) {
      console.error("Error fetching  top rater battlers", error);
    } finally {
      setTopRaterBattlerLoading(false);
    }
  };

  const fetchMostConsistentUsers = async () => {
    setMostConsistentUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.MOST_CONSISTENT_USERS)
        .select("*");
      if (error) {
        console.error("Error fetching most consistent users", error);
      }
      setMostConsistentUsers(data as MostConsistentUsers[]);
    } catch (error) {
      console.error("Error fetching most consistent users", error);
    } finally {
      setMostConsistentUsersLoading(false);
    }
  };

  const fetchMostInfluentialUsers = async () => {
    setMostInfluentialUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.MOST_INFLUENCED_USERS)
        .select("*");
      if (error) {
        console.error("Error fetching most influential users", error);
      }
      setMostInfluentialUsers(data as MostInfluentialUsers[]);
    } catch (error) {
      console.error("Error fetching most influential users", error);
    } finally {
      setMostInfluentialUsersLoading(false);
    }
  };

  const fetchMostAccurateUsers = async () => {
    setMostAccurateUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.MOST_ACCURATE_USERS)
        .select("*");
      if (error) {
        console.error("Error fetching most accurate users", error);
      }
      setMostAccurateUsers(data as MostAccurateUsers[]);
    } catch (error) {
      console.error("Error fetching most accurate users", error);
    } finally {
      setMostAccurateUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityStats();
    fetchRatingDistribution();
    fetchActiveRolesByRatings();
    fetchTopRaterBattlers();
    fetchMostConsistentUsers();
    fetchMostInfluentialUsers();
    fetchMostAccurateUsers();
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
