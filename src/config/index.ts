const ROLE = {
  ADMIN: 1,
  ARTIST: 2,
  MEDIA: 3,
  FAN: 4,
  LEAGUE_OWNER_INVESTOR: 5,
};

const ROLES = Object.values(ROLE);

const ROLES_NAME = {
  [ROLE.ADMIN]: "Admin",
  [ROLE.ARTIST]: "Artist",
  [ROLE.MEDIA]: "Media",
  [ROLE.FAN]: "Fan",
  [ROLE.LEAGUE_OWNER_INVESTOR]: "League Owner/Investor",
};

const LEADERBOARD_TAB_TYPE = {
  MOST_RATINGS: "most-ratings",
  MOST_ACCURATE: "most-accurate",
  MOST_FOLLOWED: "most-followed",
};

const RANKING_TYPE = {
  WEIGHTED: "weighted",
  UNWEIGHTED: "unweighted",
};
const DB_TABLES = {
  USERS: "users",
  BATTLERS: "battlers",
  BATTLERS_TAGS: "battler_tags",
  TAGS: "tags",
  USER_PERMISSIONS: "user_permissions",
  BADGES: "badges",
  ATTRIBUTES: "attributes",
  BATTLER_BADGES: "battler_badges",
  BATTLER_RATINGS: "battler_ratings",
  RATING_ROLE_WEIGHTS: "rating_role_weights",
  BATTLER_ANALYTICS: "battler_analytics",
  MEDIA_CONTENT: "media_content",
  HIGHLIGHTS: "highlights",
  WEIGHTED_BATTLER_ANALYTICS: "weighted_battler_analytics",
  NEWS_CONTENTS: "news_contents",
};

const MATERIALIZED_VIEWS = {
  TOP_POSITIVE_BADGES: "most_common_positive_badges",
  TOP_NEGATIVE_BADGES: "most_common_negative_badges",
  AVERAGE_RATING_TRENDS_BY_CATEGORY: "average_rating_trends_over_time_by_category",
  AVERAGE_RATINGS_BY_CATEGORY: "average_ratings_by_category",
  AVERAGE_RATINGS_OVER_TIME: "average_ratings_over_time",
  COMMUNITY_RATING_DISTRIBUTION: "community_rating_distribution",
  MOST_VALUED_ATTRUBUTES: "most_valued_attributes",
  MOST_ASSIGNED_BADGES: "most_assigned_badges",
  TOP_BATTLERS_UNWEIGHTED: "top_battlers_unweighted",
  COMMUNITY_STATS: "leaderboard_community_stats",
  RATING_DISTRIBUTION: "leaderboard_rating_distribution",
  ACTIVE_ROLES_BY_RATINGS: "leaderboard_active_roles_by_ratings",
  TOP_BATTLER_WEIGHTED: "top_battlers_weighted",
  TOP_RATERS: "top_raters",
  MOST_INFLUENCED_USERS: "most_influenced_users",
  MOST_CONSISTENT_USERS: "most_consistent_users",
  MOST_ACCURATE_USERS: "most_accurate_users",
  TOP_ASSIGNED_BADGES_BY_BATTLERS: "top_assigned_badges_by_battlers",
  RANDOM_MEDIA_USERS_VIEW: "random_media_users_view",
};

const RPC_FUNCTIONS = {
  GET_TOP_BATTLERS_BY_RATING: "get_top_battlers_by_rating",
  BATTLER_FILTER: "battler_filter",
  BATTLER_FILTER_COUNT: "battler_filter_count",
  ALL_MY_RATINGS_BATTLERS: "all_my_ratings_battlers",
};

const BUCKET_NAME = "battleraprank";

const PERMISSION = {
  COMMUNITY_MANAGER: {
    [DB_TABLES.BATTLERS]: {
      create: true,
    },
  },
};

const PERMISSIONS = {
  COMMUNITY_MANAGER: "COMMUNITY_MANAGER",
};

const ATTRIBUTE_CATEGORIES = {
  WRITING: "writing",
  PERFORMANCE: "performance",
  PERSONAL: "personal",
};

const PROMPT_MANAGEMENT_KEYS = {
  TWITTER_ACCOUNT_ANALYSIS: "news:TWITTER_ACCOUNT_ANALYSIS",
  CROSS_ACCOUNT_ANALYSIS: "news:CROSS_ACCOUNT_ANALYSIS",
  YOUTUBE_CONTEXT_EXPANSION: "news:YOUTUBE_CONTEXT_EXPANSION",
  ADDITIONAL_ACCOUNT_ANALYSIS: "news:ADDITIONAL_ACCOUNT_ANALYSIS",
  STORYLINE_CONSOLIDATION: "news:STORYLINE_CONSOLIDATION",
  CONTENT_GENERATION: "news:CONTENT_GENERATION",
};

const PROMPT_KEY = Object.values(PROMPT_MANAGEMENT_KEYS);

const PAGES = {
  SIGN_UP: "/auth/signup",
  LOGIN: "/auth/login",
  SELECT_ROLE: "/auth/signup/role",
  RESET_PASSWORD: "/reset-password",
  FORGOT_PASSWORD: "/forgot-password",
  BATTLERS: "/battlers",
  HOME: "/",
  ADMIN_USER_LIST: "/admin/user-list",
  ADMIN_BATTLERS: "/admin/battlers",
  FAVORITES: "/favorites",
  ADMIN_TOOLS: "/admin-tools",
  RANKINGS: "/rankings",
  LEADERBOARD: "/leaderboard",
  MEDIA: "/media",
  ANALYTICS: "/analytics",
  DIAGNOSTICS: "/diagnostics",
  MY_RATINGS: "/my-ratings",
  PROFILE: "/profile",
  NEWS: "/news",
  ADMIN: "/admin",
  NOTIFICATIONS: "/notifications",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  SETTINGS: "/settings",
  NEWS_PROMPTS: "/admin/news-prompts",
};

export {
  ROLE,
  ROLES,
  ROLES_NAME,
  PAGES,
  DB_TABLES,
  PERMISSION,
  MATERIALIZED_VIEWS,
  RPC_FUNCTIONS,
  ATTRIBUTE_CATEGORIES,
  LEADERBOARD_TAB_TYPE,
  RANKING_TYPE,
  BUCKET_NAME,
  PERMISSIONS,
  PROMPT_MANAGEMENT_KEYS,
  PROMPT_KEY,
};
