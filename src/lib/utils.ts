import { ROLE, PERMISSIONS } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAdmin(role: number) {
  return role === ROLE.ADMIN;
}

export function isCommunityManager(permission: string) {
  return permission === PERMISSIONS.COMMUNITY_MANAGER;
}

export function isAdminOrCommunityManager(role: number, permission: string) {
  return isAdmin(role) || isCommunityManager(permission);
}
