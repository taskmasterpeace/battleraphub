import { PAGES, PERMISSIONS, ROLE } from "@/config";
import { NavItem, NavList } from "@/types";
import { User } from "@supabase/supabase-js";
import {
  Trophy,
  Database,
  Users,
  BarChart2,
  Video,
  Home,
  Award,
  Star,
  Newspaper,
} from "lucide-react";

export const NAV_LINKS: NavList[] = [
  { href: PAGES.HOME, label: "Home", icon: null, roles: [], permissions: [], children: [] },
  { href: PAGES.BATTLERS, label: "Battlers", icon: null, roles: [], permissions: [], children: [] },
  {
    href: PAGES.ANALYTICS,
    label: "Analytics",
    icon: null,
    roles: [],
    permissions: [],
    children: [],
  },
  {
    href: PAGES.LEADERBOARD,
    label: "Leaderboard",
    icon: <Trophy className="w-4 h-4 inline mr-1" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.ADMIN_TOOLS,
    label: "Admin",
    icon: <Database className="w-4 h-4 inline -mr-1" />,
    children: [
      {
        label: "Admin Tools",
        href: PAGES.ADMIN_TOOLS,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "Users",
        href: PAGES.ADMIN_USER_LIST,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "Battlers",
        href: PAGES.ADMIN_BATTLERS,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "News Tools",
        href: PAGES.NEWS_PROMPTS,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
    ],
    roles: [],
    permissions: [],
  },
  { href: PAGES.DIAGNOSTICS, label: "Diagnostics", icon: null, roles: [], permissions: [] },
  {
    href: PAGES.NEWS,
    label: "News",
    icon: <Newspaper className="w-4 h-4 mr-1" />,
    roles: [],
    permissions: [],
  },
];

export const mainNavItems: NavList[] = [
  {
    href: PAGES.HOME,
    label: "Home",
    icon: <Home className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
    children: [],
  },
  {
    href: PAGES.BATTLERS,
    label: "Battlers",
    icon: <Users className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.ANALYTICS,
    label: "Analytics",
    icon: <BarChart2 className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.MEDIA,
    label: "Media",
    icon: <Video className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
];

export const secondaryNavItems: NavList[] = [
  {
    href: PAGES.LEADERBOARD,
    label: "Leaderboard",
    icon: <Trophy className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.RANKINGS,
    label: "Rankings",
    icon: <Award className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.FAVORITES,
    label: "Favorites",
    icon: <Star className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.ADMIN_TOOLS,
    label: "Admin",
    icon: <Database className="w-5 h-5 inline mr-3" />,
    children: [
      {
        label: "Admin Tools",
        href: PAGES.ADMIN_TOOLS,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "Users",
        href: PAGES.ADMIN_USER_LIST,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "Battlers",
        href: PAGES.ADMIN_BATTLERS,
        roles: [ROLE.ADMIN],
        permissions: [PERMISSIONS.COMMUNITY_MANAGER],
        icon: null,
      },
    ],
    roles: [],
    permissions: [],
  },
  {
    href: PAGES.NEWS,
    label: "News",
    icon: <Newspaper className="w-5 h-5 mr-3" />,
    roles: [],
    permissions: [],
  },
];

type UserMetadata = {
  role?: string;
  permission?: string;
};

const hasRequiredRole = (requiredRoles: number[], userRole: number): boolean => {
  if (!requiredRoles.length) return true;
  if (!userRole) return false;
  if (requiredRoles.includes(userRole)) return true;
  return false;
};

const hasRequiredPermission = (requiredPermissions: string[], userPermission: string): boolean => {
  if (!requiredPermissions.length) return true;
  if (!userPermission) return false;
  if (requiredPermissions.includes(userPermission)) return true;
  return false;
};

const filterNavChildren = (
  children: NavItem[] = [],
  role: number,
  permission: string = "",
): NavItem[] => {
  if (!Array.isArray(children)) return [];

  return children.filter(
    (child) =>
      hasRequiredRole(child.roles, role) && hasRequiredPermission(child.permissions, permission),
  );
};

export const filterNavList = (links: NavList[], user: User | null): NavList[] => {
  if (!Array.isArray(links)) return [];

  const metadata = user?.user_metadata as UserMetadata | undefined;
  const role = isNaN(Number(metadata?.role)) ? ROLE.FAN : Number(metadata?.role);
  const permission = metadata?.permission || "";

  return links.filter((link) => {
    const meetsBaseRequirements =
      hasRequiredRole(link.roles, role) && hasRequiredPermission(link.permissions, permission);

    if (Array.isArray(link.children) && link.children.length > 0) {
      const filteredChildren = filterNavChildren(link.children, role, permission);
      if (filteredChildren.length) {
        link.children = filteredChildren;
        return true;
      }
      return false;
    }

    return meetsBaseRequirements;
  });
};
