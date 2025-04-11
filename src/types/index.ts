export interface Battler {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  change?: number;
  bio?: string;
  accolades?: string[];
  badges?: string[];
  tags?: string[];
  spotlightBadges?: string[];
  weightedRating?: number;
  unweightedRating?: number;
  userType?: "media" | "battler" | "league_owner" | "admin";
  lastUpdated: string;
}

export interface MediaUser {
  id: string;
  name: string;
  image: string;
  outlet: string;
  bio: string;
  socialLinks: {
    youtube?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  recentContent: {
    title: string;
    url: string;
    type: "video" | "article" | "podcast";
    thumbnail?: string;
    likes: number;
    date: string;
  }[];
}

export interface CommunityStats {
  totalRatings: number;
  activeUsers: number;
  recentBattles: number;
  topBadges: { badge: string; count: number }[];
  activityData: { date: string; ratings: number }[];
}

export interface AnalyticsData {
  title: string;
  description: string;
  chartData: { name: string; value: number }[];
  dataKey: string;
  color: string;
}
