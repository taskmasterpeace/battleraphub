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
  value?: number;
}

export interface CommunityStats {
  total_users: number;
  total_ratings: number;
  new_users_this_week: number;
  new_ratings_this_week: number;
  avg_rating: number;
  active_users_last_30_days: number;
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
  battler_badges?: {
    badges?: {
      id: number;
      is_positive: boolean;
      name: string;
    };
  }[];
  battler_analytics?: {
    type: number;
    score: number;
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
    role_id?: number;
  };
  created_at?: string;
}

export interface Tags {
  id: number;
  name?: string;
  created_at?: string;
  updated_at?: string;
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
  backgroundColor: string;
  description: string;
}

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
export interface BattlerAttribute {
  battler_id: string;
  name?: string;
  average_score?: number;
  avatar: string;
  location: string;
}

export interface Contributor {
  title: string;
  description: string;
  data: {
    user_id?: string;
    name: string;
    avatar?: string;
    average_rating?: number;
    accuracy_score?: number;
    avg_diff_from_community?: number;
    ratings_given?: number;
  }[];
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
  user_id: string;
  avatar: string;
  name: string;
  ratings_given: number;
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
  user_id: string;
  name: string;
  avatar: string;
  ratings_given: number;
  accuracy_score: number;
}

export interface MediaContent {
  id: string;
  user_id: string;
  date: string;
  type: "video" | "article" | "";
  title: string;
  description: string;
  thumbnail_img: string;
  link: string;
  created_at: string;
  updated_at: string;
}

export interface RoleDataType {
  role_id: number;
  weight: number;
}

export interface ChartConfig {
  categoryTypes: string[];
  colorOptions: string[];
  attributes: Attribute[];
}

export interface ChartData {
  [key: string]: {
    title: string;
    description: string;
    data: { name: string; value: string }[];
    barColor: string;
  };
}

export interface ComparisonChartData {
  [key: string]: {
    title: string;
    description: string;
    data: { name: string; [label: string]: string }[];
    barColor: string;
  };
}

export type Rating = { attribute_id: number; score: number };

export interface TopAssignBadgeByBattler {
  score: number;
  battler_id: string;
  badge_id: string;
  badge_name: string;
  is_positive: boolean;
  assign_count: number;
  percentage: number;
  description: string;
}

export interface YoutubeVideoType {
  id: string;
  date?: string;
  link?: string;
  thumbnail_img?: string;
  title: string;
  tag: string;
  description?: string;
  likes: number;
  views?: number;
}

export interface RelatedAnalysisItem {
  title: string;
  published: string;
  icon: string;
}
export interface NewsItem {
  id: string;
  headline: string;
  published_at?: string;
  updated_at: string;
  created_at: string;
  event_date: string;
  tags: string[];
  reading_time: string;
  blurb: string;
  main_content: string;
}

export interface Cluster {
  narrative: string;
  score: number;
}
