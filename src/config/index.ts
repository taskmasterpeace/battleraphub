const ROLE = {
  ADMIN: 1,
  BATTLE: 2,
  MEDIA: 3,
  FAN: 4,
  LEAGUE_OWNER_INVESTOR: 5,
};

const ROLES = Object.values(ROLE);

const ROLES_NAME = {
  [ROLE.ADMIN]: "Admin",
  [ROLE.BATTLE]: "Battler",
  [ROLE.MEDIA]: "Media",
  [ROLE.FAN]: "Fan",
  [ROLE.LEAGUE_OWNER_INVESTOR]: "League Owner/Investor",
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

const PAGES = {
  SIGN_UP: "/auth/signup",
  LOGIN: "/auth/login",
  SELECT_ROLE: "/auth/signup/role",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  BATTLERS: "/battlers",
  HOME: "/",
  PROTECTED: "/protected",
  ADMIN_USER_LIST: "/admin/user-list",
  ADMIN_BATTLERS: "/admin/battlers",
  FAVORITES: "/favorites",
  ADMIN_TOOLS: "/admin-tools",
  RANKINGS: "/rankings",
  LEADERBOARD: "/leaderboard",
  MEDIA: "/media",
  ANALYTICS: "/analytics",
  DIAGNOSTICS: "/diagnostics",
};

export {
  ROLE,
  ROLES,
  ROLES_NAME,
  PAGES,
  DB_TABLES,
  PERMISSION,
  ATTRIBUTE_CATEGORIES,
  BUCKET_NAME,
  PERMISSIONS,
};
