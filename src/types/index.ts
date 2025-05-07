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
  id: number;
  category: string;
  name: string;
  description: string;
  is_positive: boolean;
}

export type Category = "writing" | "performance" | "personal";

// Ex: "Writing" - "Wordplay" - "Use of complex words"
export interface Attribute {
  id: number;
  category: Category;
  name: string;
  description?: string;
}

export interface CommunityStats {
  total_users: number;
  total_ratings: number;
  new_users_this_week: number;
  new_ratings_this_week: number;
  avg_rating: number;
  active_users_last_30_days: number;
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
  email: string;
  user_permissions?: {
    user_id?: string;
    permission?: string;
  }[];
  bio?: string;
  avatar: string;
  role_id?: number;
  youtube: string;
  twitter: string;
  instagram: string;
  verified?: boolean;
  added_by?: string;
  image?: string;
  created_at?: string;
  location?: string;
  website?: string;
}

export interface Battlers {
  id: string;
  battler_tags?: {
    tags: {
      id: string;
      name: string;
    };
  }[];
  added_by?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  score?: number;
  location?: string;
  banner?: string;
  users?: {
    added_by: string;
  };
  created_at?: string;
}

export interface TagsOption {
  id: number;
  tagId?: string;
  name: string;
}
export interface NavList extends NavItem {
  children?: NavItem[];
}
export interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: number[];
  permissions: string[];
}

export interface rolesWeights {
  id: number;
  role_id: number;
  formKey: string;
  key: string;
  label: string;
  color: string;
  description: string;
}

export type RoleKey = "fan" | "media" | "battler" | "league_owner" | "admin";

export interface BattlerAnalytics {
  id: string;
  battler_id: string;
  attribute_id: number;
  type: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface BattlerRating {
  id: string;
  user_id: string;
  battler_id: string;
  attribute_id: number;
  score: number;
  prev_score: number;
  created_at: string;
  updated_at: string;
}

// For analytic and leaderboard static data

export interface RoleWeight {
  role: RoleKey;
  role_id: number;
  displayName: string;
  color: string;
  backgroundColor: string;
}

export interface BattlerAttribute {
  battler_id: string;
  name?: string;
  average_score?: number;
  avatar: string;
  location: string;
}

export interface TopContributor {
  userId: string;
  username: string;
  displayName: string;
  profileImage?: string;
  contribution: string;
  score: number;
  description: string;
}

export type CommunityStatCards = {
  total_users: number;
  new_users_this_week: number;
  total_ratings: number;
  new_ratings_this_week: number;
  avg_rating: number;
  active_users_last_30_days: number;
  recentBattles?: number;
  topBadges?: {
    badge: string;
    count: number;
  }[];
};

export type MostValuedAttributes = {
  attribute_id: string;
  attribute_name: string;
  category: string;
  avg_rating: number;
  rating_count: number;
};

export type MostAssignedBadges = {
  badge_id: string;
  badge_name: string;
  description: string;
  category: string;
  assigned_count: number;
};

export type AvgRatingsOverTime = {
  month: string;
  avg_rating?: number;
  total_ratings?: number;
};

export type TopBattlersUnweighted = {
  battler_id: string;
  assigned_badges: {
    name: string;
    is_positive: boolean;
  }[];
  avg_rating: number;
  name: string;
  avatar: string;
  location: string;
  score: number;
};

export type AverageRatingByCategory = {
  category: string;
  avg_rating: number;
};

export type TopBadges = {
  badge_id: string;
  badge_name: string;
  description: string;
  times_assigned: number;
};

export type RatingCommunityDistribution = {
  bucket: string;
  rating_count: number;
};

export type TrendOverTimeByCategory = {
  month: string;
  [key: string]: string | number;
};

export type MyRating = {
  avatar: string;
  name: string;
  assigned_badges: {
    name: string;
    is_positive: boolean;
  }[];
  battler_id: string;
  average_score: number;
  created_at: string;
};

export interface UserBadge {
  id: string;
  user_id: string;
  battler_id: string;
  badge_id: string;
  badges: Badge;
}

export interface VideoStatistics {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

export interface YoutubeSearchResponse {
  items: {
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { high: { url: string } };
    };
  }[];
}

export interface YoutubeVideoStatsResponse {
  items: {
    id: string;
    statistics: VideoStatistics;
  }[];
}

export interface RatingDistribution {
  bucket: string;
  percentage: number;
  count: number;
}

export interface ActiveRolesByRatings {
  role_id: number;
  rating_count: number;
  percentage: number;
}

export interface TopRaterBattler {
  user_id?: string;
  avatar?: string;
  name?: string;
  battlers_rated: number;
}

export interface MostConsistentUsers {
  user_id: string;
  name: string;
  avatar: string;
  ratings_given: number;
  average_rating: number;
  ratting_stddev: number;
}

export interface MostInfluentialUsers {
  user_id: string;
  name: string;
  avatar: string;
  ratings_given: number;
  avg_diff_from_community: number;
}

export interface MostAccurateUsers {
  user_id?: string;
  rating_stddev: number;
  avg_diff_from_community: number;
  accuracy_score: number;
  name: string;
}

export interface FilteredData {
  name: string;
  avatar: string;
  ratings_given: number;
  battlers_rated: number;
  accuracy_score: number;
}
