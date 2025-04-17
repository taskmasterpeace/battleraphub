export interface Battler {
  id: number;
  name: string;
  image: string;
  location: string;
  rating?: number;
  change?: number;
  bio?: string;
  accolades?: string[];
  badges?: string[];
  tags?: string[];
  spotlightBadges?: string[];
  weightedRating?: number;
  unweightedRating?: number;
  userType?: "media" | "battler" | "league_owner" | "admin";
  banner?: string;
  totalPoints?: number;
  createdAt?: Date;
  addedBy?: string; // ID of the user who added this battler
  addedAt?: string; // When the battler was added
  lastUpdated?: string;
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

export interface Badge {
  category: string;
  badge: string;
  description: string;
  isPositive: boolean;
}

// Ex: "Writing" - "Wordplay" - "Use of complex words"
export interface Attribute {
  category: string;
  attribute: string;
  description: string;
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

export interface User {
  id: string;
  name: string;
  user_permissions: {
    user_id: string;
  }[];
  avatar: string;
  role_id: number;
  youtube: string;
  twitter: string;
  instagram: string;
  verified: boolean;
  added_by: string;
}

export interface Battlers {
  id: string;
  battler_tags: {
    tags: {
      id: string;
      name: string;
    };
  }[];
  name: string;
  avatar: string;
  bio: string;
  location: string;
}

export interface TagsOption {
  id: number;
  tagId?: string;
  name: string;
}
