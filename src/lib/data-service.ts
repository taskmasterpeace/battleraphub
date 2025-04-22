"use server";

import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import { Battler } from "@/types";

// Mock data for battlers
const battlersMock: Battler[] = [
  {
    id: 1,
    name: "Loaded Lux",
    location: "Harlem, NY",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Veteran", "Lyricist"],
    totalPoints: 8.7,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    name: "Tsu Surf",
    location: "Newark, NJ",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Puncher"],
    totalPoints: 8.5,
    createdAt: new Date("2023-02-10"),
  },
  {
    id: 3,
    name: "Geechi Gotti",
    location: "Compton, CA",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Performance"],
    totalPoints: 8.9,
    createdAt: new Date("2023-03-05"),
  },
  {
    id: 4,
    name: "Rum Nitty",
    location: "Phoenix, AZ",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Puncher"],
    totalPoints: 9.0,
    createdAt: new Date("2023-04-20"),
  },
  {
    id: 5,
    name: "JC",
    location: "Pontiac, MI",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Lyricist"],
    totalPoints: 8.5,
    createdAt: new Date("2023-05-15"),
  },
  {
    id: 6,
    name: "K-Shine",
    location: "Harlem, NY",
    image: "/placeholder.svg?height=400&width=400",
    banner: "/placeholder.svg?height=200&width=1200",
    tags: ["URL", "Performance"],
    totalPoints: 8.3,
    createdAt: new Date("2023-06-10"),
  },
];

// Get battlers
export const getBattlers = cache(async (): Promise<Battler[]> => {
  // In a real app, this would fetch from a database
  return battlersMock;
});

// Get a single battler by ID
export const getBattlerById = cache(async (id: number): Promise<Battler | null> => {
  // In a real app, this would fetch from a database
  const battler = battlersMock.find((b) => b.id === id);
  return battler || null;
});

// Admin functions (would connect to a database in a real app)

export async function createBattler(battler: Omit<Battler, "id" | "createdAt">): Promise<Battler> {
  // In a real app, this would insert into a database
  const newBattler: Battler = {
    ...battler,
    id: battlersMock.length + 1,
    createdAt: new Date(),
  };

  battlersMock.push(newBattler);
  return newBattler;
}

export async function updateBattler(
  id: number,
  battler: Partial<Battler>,
): Promise<Battler | null> {
  // In a real app, this would update a database record
  const index = battlersMock.findIndex((b) => b.id === id);
  if (index === -1) return null;

  battlersMock[index] = { ...battlersMock[index], ...battler };
  return battlersMock[index];
}

export async function deleteBattler(id: number): Promise<boolean> {
  // In a real app, this would delete from a database
  const index = battlersMock.findIndex((b) => b.id === id);
  if (index === -1) return false;

  battlersMock.splice(index, 1);
  return true;
}

// Get user by username
export const getUserByUsername = cache(async (username: string): Promise<null> => {
  console.log("Getting user by username:", username);
  // In a real app, this would fetch from a database
  return null;
});

export async function updateUserAddedBattler(userId: string, battleId: string): Promise<void> {
  // In a real app, this would update the user's addedBattlers array
  const supabaseClient = await createClient();
  const { data: user, error: userError } = await supabaseClient
    .from("user_profiles")
    .select("addedBattlers")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    throw userError;
  }

  const addedBattlers = user?.addedBattlers || [];
  const { error } = await supabaseClient
    .from("user_profiles")
    .update({ addedBattlers: [...addedBattlers, battleId] })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user's addedBattlers:", error);
    throw error;
  }
}
