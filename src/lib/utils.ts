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

// json response function
export function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// extract youtube handle function
export function extractYouTubeHandle(url: string) {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

// formate date function
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
