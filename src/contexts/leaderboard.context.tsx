"use client";

import { MATERIALIZED_VIEWS } from "@/config";
import { useFormSubmit } from "@/hooks/useFormSubmit";
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
  const [activeRolesByRatings, setActiveRolesByRatings] = useState<ActiveRolesByRatings[] | null>(
    null,
  );
  const [topRatersBattler, setTopRatersBattler] = useState<TopRaterBattler[]>([]);
  const [mostConsistentUsers, setMostConsistentUsers] = useState<MostConsistentUsers[]>([]);
  const [mostInfluentialUsers, setMostInfluentialUsers] = useState<MostInfluentialUsers[]>([]);
  const [mostAccurateUsers, setMostAccurateUsers] = useState<MostAccurateUsers[]>([]);

  const { onSubmit: fetchCommunityStats, processing: communityLoading } = useFormSubmit(
    async () => {
      try {
        const { data, error } = await supabase.from(MATERIALIZED_VIEWS.COMMUNITY_STATS).select("*");
        if (error) {
          console.error("Error fetching community stats", error);
        }
        setCommunityStats(data?.[0] as CommunityStats);
      } catch (error) {
        console.error("Error fetching community stats", error);
      }
    },
  );

  const { onSubmit: fetchRatingDistribution, processing: ratingDistributionLoading } =
    useFormSubmit(async () => {
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
      }
    });

  const { onSubmit: fetchActiveRolesByRatings, processing: activeRolesByRatingLoading } =
    useFormSubmit(async () => {
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
      }
    });

  const { onSubmit: fetchTopRaterBattlers, processing: topRaterBattlerLoading } = useFormSubmit(
    async () => {
      try {
        const { data, error } = await supabase.from(MATERIALIZED_VIEWS.TOP_RATERS).select("*");
        if (error) {
          console.error("Error fetching top rater battlers", error);
        }
        setTopRatersBattler(data as TopRaterBattler[]);
      } catch (error) {
        console.error("Error fetching  top rater battlers", error);
      }
    },
  );

  const { onSubmit: fetchMostConsistentUsers, processing: mostConsistentUsersLoading } =
    useFormSubmit(async () => {
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
      }
    });

  const { onSubmit: fetchMostInfluentialUsers, processing: mostInfluentialUsersLoading } =
    useFormSubmit(async () => {
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
      }
    });

  const { onSubmit: fetchMostAccurateUsers, processing: mostAccurateUsersLoading } = useFormSubmit(
    async () => {
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
      }
    },
  );

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
