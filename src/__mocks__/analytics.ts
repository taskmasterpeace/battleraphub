"use client";

import { ROLE, ROLES_NAME } from "@/config";
import { RoleWeight } from "@/types";

// Default weights for each role (same as in role-weight-service.ts)
export const defaultRoleWeights: RoleWeight[] = [
  {
    role: "fan",
    role_id: ROLE.FAN,
    displayName: ROLES_NAME[ROLE.FAN],
    color: "orange",
    backgroundColor: "bg-orange-500",
  },
  {
    role: "media",
    role_id: ROLE.MEDIA,
    displayName: ROLES_NAME[ROLE.MEDIA],
    color: "purple",
    backgroundColor: "bg-primary",
  },
  {
    role: "battler",
    role_id: ROLE.BATTLE,
    displayName: ROLES_NAME[ROLE.BATTLE],
    color: "green",
    backgroundColor: "bg-success",
  },
  {
    role: "league_owner",
    role_id: ROLE.LEAGUE_OWNER_INVESTOR,
    displayName: ROLES_NAME[ROLE.LEAGUE_OWNER_INVESTOR],
    color: "amber",
    backgroundColor: "bg-amber-500",
  },
  {
    role: "admin",
    role_id: ROLE.ADMIN,
    displayName: ROLES_NAME[ROLE.ADMIN],
    color: "red",
    backgroundColor: "bg-destructive",
  },
];
