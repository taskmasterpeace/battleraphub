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

const PAGES = {
  SIGN_UP: "/auth/signup",
  LOGIN: "/auth/login",
  SELECT_ROLE: "/auth/signup/role",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  BATTLERS: "/battlers",
  HOME: "/",
  PROTECTED: "/protected",
};

export { ROLE, ROLES, ROLES_NAME, PAGES, DB_TABLES, PERMISSION, BUCKET_NAME, PERMISSIONS };
