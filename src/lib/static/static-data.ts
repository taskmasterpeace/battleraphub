import { ROLE, ROLES_NAME } from "@/config";
import { rolesWeights } from "@/types";

export const rolesWeightData: rolesWeights[] = [
  {
    id: 1,
    role_id: ROLE.FAN,
    formKey: "fan",
    key: ROLES_NAME[ROLE.FAN],
    label: "Fan",
    color: "bg-blue-500",
    description: "Battle rap enthusiasts and viewers",
  },
  {
    id: 2,
    role_id: ROLE.MEDIA,
    formKey: "media",
    key: ROLES_NAME[ROLE.MEDIA],
    label: "Media",
    color: "bg-purple-500",
    description: "Battle rap journalists, bloggers, and content creators",
  },
  {
    id: 3,
    role_id: ROLE.BATTLE,
    formKey: "battler",
    key: ROLES_NAME[ROLE.BATTLE],
    label: "Battler",
    color: "bg-green-500",
    description: "Active battle rappers",
  },
  {
    id: 4,
    role_id: ROLE.LEAGUE_OWNER_INVESTOR,
    formKey: "league_owner",
    key: ROLES_NAME[ROLE.LEAGUE_OWNER_INVESTOR],
    label: "League Owner",
    color: "bg-amber-500",
    description: "Owners and operators of battle rap leagues",
  },
  {
    id: 5,
    role_id: ROLE.ADMIN,
    formKey: "admin",
    key: ROLES_NAME[ROLE.ADMIN],
    label: "Admin",
    color: "bg-red-500",
    description: "Platform administrators",
  },
];
