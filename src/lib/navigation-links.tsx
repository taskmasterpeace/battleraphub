import { PAGES, PERMISSIONS, ROLE } from "@/config";
import { NavItem, NavList } from "@/types";
import { User } from "@supabase/supabase-js";
import { Trophy, Database, Users, BarChart2, Video, Home, Award, Star } from "lucide-react";

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
    icon: <Database className="w-4 h-4 inline mr-1" />,
    children: [
      {
        label: "Users",
        href: PAGES.ADMIN_USER_LIST,
        roles: [ROLE.ADMIN],
        permissions: [PERMISSIONS.COMMUNITY_MANAGER],
        icon: null,
      },
      {
        label: "Battlers",
        href: PAGES.ADMIN_BATTLERS,
        roles: [],
        permissions: [PERMISSIONS.COMMUNITY_MANAGER],
        icon: null,
      },
    ],
    roles: [],
    permissions: [],
  },
  { href: PAGES.DIAGNOSTICS, label: "Diagnostics", icon: null, roles: [], permissions: [] },
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
        label: "Users",
        href: PAGES.ADMIN_USER_LIST,
        roles: [ROLE.ADMIN],
        permissions: [],
        icon: null,
      },
      {
        label: "Battlers",
        href: PAGES.ADMIN_BATTLERS,
        roles: [],
        permissions: [PERMISSIONS.COMMUNITY_MANAGER],
        icon: null,
      },
    ],
    roles: [],
    permissions: [],
  },
];

export const filterNavList = (links: NavList[], user: User | null) => {
  return links.filter((link) => {
    const hasRequiredRole =
      !link.roles.length ||
      (user?.user_metadata?.role && link.roles.includes(user.user_metadata.role));
    const hasRequiredPermission =
      !link.permissions.length ||
      (user?.user_metadata?.permission && link.permissions.includes(user.user_metadata.permission));

    if (link.href === PAGES.ADMIN_TOOLS) {
      let visibleChildren: NavItem[] = [];

      if (link.children) {
        visibleChildren = link.children.filter((child) => {
          const hasChildRequiredRole =
            !child.roles.length ||
            (user?.user_metadata?.role && child.roles.includes(user.user_metadata.role));
          const hasChildRequiredPermission =
            !child.permissions.length ||
            (user?.user_metadata?.permission &&
              child.permissions.includes(user.user_metadata.permission));

          return hasChildRequiredRole && hasChildRequiredPermission;
        });
      }

      if (visibleChildren.length > 0) {
        link.children = visibleChildren;
        return true;
      }

      return false;
    }

    return hasRequiredRole && hasRequiredPermission;
  });
};
