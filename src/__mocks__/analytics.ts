"use client";

import { BattlerAttribute, RoleWeight, RoleKey } from "@/types";

export const defaultMockData = {
  topRatedBattlers: [
    { id: "1", name: "Loaded Lux", total_points: 9.2 },
    { id: "2", name: "Rum Nitty", total_points: 9.0 },
    { id: "3", name: "Geechi Gotti", total_points: 8.9 },
    { id: "4", name: "Tsu Surf", total_points: 8.7 },
    { id: "5", name: "JC", total_points: 8.5 },
    { id: "6", name: "K-Shine", total_points: 8.3 },
    { id: "7", name: "Hitman Holla", total_points: 8.2 },
    { id: "8", name: "Charlie Clips", total_points: 8.1 },
    { id: "9", name: "Daylyt", total_points: 8.0 },
    { id: "10", name: "T-Rex", total_points: 7.9 },
  ],
  categoryAverages: [
    { name: "Writing", average: 8.2 },
    { name: "Performance", average: 7.8 },
    { name: "Personal", average: 8.0 },
  ],
  trendData: [
    { month: "Jan", rating: 7.5 },
    { month: "Feb", rating: 7.8 },
    { month: "Mar", rating: 8.0 },
    { month: "Apr", rating: 8.2 },
    { month: "May", rating: 8.5 },
    { month: "Jun", rating: 8.3 },
    { month: "Jul", rating: 8.7 },
    { month: "Aug", rating: 8.9 },
    { month: "Sep", rating: 9.0 },
    { month: "Oct", rating: 9.2 },
  ],
};

export const battlers = [
  { id: "1", name: "Loaded Lux" },
  { id: "2", name: "Tsu Surf" },
  { id: "3", name: "Geechi Gotti" },
  { id: "4", name: "Rum Nitty" },
  { id: "5", name: "JC" },
  { id: "6", name: "K-Shine" },
];

export const mostCommonPositiveBadgesData = [
  { name: "Wordsmith", count: 85 },
  { name: "Pen Game", count: 72 },
  { name: "Battle IQ", count: 68 },
  { name: "Consistent", count: 55 },
  { name: "Versatile", count: 42 },
];

export const mostCommonNegativeBadgesData = [
  { name: "Inconsistent", count: 45 },
  { name: "Predictable", count: 38 },
  { name: "Chokes", count: 32 },
  { name: "One-Dimensional", count: 28 },
  { name: "Low Energy", count: 25 },
];

export const attributeBreakdownData = [
  { name: "Wordplay", rating: 8.5 },
  { name: "Punchlines", rating: 7.2 },
  { name: "Schemes", rating: 9.0 },
  { name: "Angles", rating: 8.8 },
  { name: "Delivery", rating: 7.5 },
  { name: "Stage Presence", rating: 8.0 },
  { name: "Crowd Control", rating: 7.8 },
  { name: "Showmanship", rating: 7.2 },
  { name: "Authenticity", rating: 9.2 },
  { name: "Battle IQ", rating: 9.5 },
  { name: "Preparation", rating: 9.0 },
  { name: "Consistency", rating: 8.0 },
];

export const communityData = [
  { rating: "0-1", count: 5 },
  { rating: "1-2", count: 12 },
  { rating: "2-3", count: 25 },
  { rating: "3-4", count: 38 },
  { rating: "4-5", count: 65 },
  { rating: "5-6", count: 120 },
  { rating: "6-7", count: 180 },
  { rating: "7-8", count: 210 },
  { rating: "8-9", count: 145 },
  { rating: "9-10", count: 75 },
];

export const mostValuedAttributesData = [
  { name: "Battle IQ", average: 8.9 },
  { name: "Wordplay", average: 8.7 },
  { name: "Punchlines", average: 8.5 },
  { name: "Authenticity", average: 8.3 },
  { name: "Delivery", average: 8.1 },
];

export const ratingTrendsData = [
  { month: "Jan", writing: 7.5, performance: 7.2, personal: 7.8 },
  { month: "Feb", writing: 7.7, performance: 7.3, personal: 7.9 },
  { month: "Mar", writing: 7.9, performance: 7.5, personal: 8.0 },
  { month: "Apr", writing: 8.1, performance: 7.7, personal: 8.2 },
  { month: "May", writing: 8.3, performance: 7.9, personal: 8.4 },
  { month: "Jun", writing: 8.2, performance: 8.0, personal: 8.3 },
  { month: "Jul", writing: 8.4, performance: 8.2, personal: 8.5 },
  { month: "Aug", writing: 8.6, performance: 8.3, personal: 8.7 },
  { month: "Sep", writing: 8.7, performance: 8.4, personal: 8.8 },
  { month: "Oct", writing: 8.9, performance: 8.6, personal: 9.0 },
];

export const categories = ["Writing", "Performance", "Personal"];

export const attributes = {
  Writing: ["Wordplay", "Punchlines", "Schemes", "Angles"],
  Performance: ["Delivery", "Stage Presence", "Crowd Control", "Showmanship"],
  Personal: ["Authenticity", "Battle IQ", "Preparation", "Consistency"],
};

// Default weights for each role (same as in role-weight-service.ts)
export const defaultRoleWeights: RoleWeight[] = [
  {
    role: "fan",
    weight: 1.0,
    displayName: "Fan",
    description: "Battle rap enthusiasts and viewers",
    color: "blue",
  },
  {
    role: "media",
    weight: 2.0,
    displayName: "Media",
    description: "Battle rap journalists, bloggers, and content creators",
    color: "purple",
  },
  {
    role: "battler",
    weight: 2.5,
    displayName: "Battler",
    description: "Active battle rappers",
    color: "green",
  },
  {
    role: "league_owner",
    weight: 3.0,
    displayName: "League Owner",
    description: "Owners and operators of battle rap leagues",
    color: "amber",
  },
  {
    role: "admin",
    weight: 5.0,
    displayName: "Admin",
    description: "Platform administrators",
    color: "red",
  },
];

// Mock battler data
const mockBattlers = [
  {
    id: "1",
    name: "Loaded Lux",
    image: "/placeholder.svg?height=300&width=300&text=Loaded+Lux",
    location: "Harlem, NY",
  },
  {
    id: "2",
    name: "Murda Mook",
    image: "/placeholder.svg?height=300&width=300&text=Murda+Mook",
    location: "Harlem, NY",
  },
  {
    id: "3",
    name: "Geechi Gotti",
    image: "/placeholder.svg?height=300&width=300&text=Geechi+Gotti",
    location: "Compton, CA",
  },
  {
    id: "4",
    name: "Rum Nitty",
    image: "/placeholder.svg?height=300&width=300&text=Rum+Nitty",
    location: "Phoenix, AZ",
  },
  {
    id: "5",
    name: "Tay Roc",
    image: "/placeholder.svg?height=300&width=300&text=Tay+Roc",
    location: "Baltimore, MD",
  },
  {
    id: "6",
    name: "Hitman Holla",
    image: "/placeholder.svg?height=300&width=300&text=Hitman+Holla",
    location: "St. Louis, MO",
  },
  {
    id: "7",
    name: "K-Shine",
    image: "/placeholder.svg?height=300&width=300&text=K-Shine",
    location: "Harlem, NY",
  },
  {
    id: "8",
    name: "Charlie Clips",
    image: "/placeholder.svg?height=300&width=300&text=Charlie+Clips",
    location: "Harlem, NY",
  },
  {
    id: "9",
    name: "Aye Verb",
    image: "/placeholder.svg?height=300&width=300&text=Aye+Verb",
    location: "St. Louis, MO",
  },
  {
    id: "10",
    name: "JC",
    image: "/placeholder.svg?height=300&width=300&text=JC",
    location: "Pontiac, MI",
  },
];

// Generate mock ratings for each battler
function generateMockRatings() {
  const categories = ["Writing", "Performance", "Personal"];
  const attributes = {
    Writing: ["Wordplay", "Punchlines", "Schemes", "Angles"],
    Performance: ["Delivery", "Stage Presence", "Crowd Control", "Showmanship"],
    Personal: ["Authenticity", "Battle IQ", "Preparation", "Consistency"],
  };

  const mockData = [];

  for (const battler of mockBattlers) {
    for (const category of categories) {
      for (const attribute of attributes[category as keyof typeof attributes]) {
        // Generate different ratings for each role
        const fanAverage = Math.random() * 3 + 7; // 7-10 range
        const mediaAverage = Math.random() * 3 + 7;
        const battlerAverage = Math.random() * 3 + 7;
        const leagueOwnerAverage = Math.random() * 3 + 7;

        // Calculate weighted average
        const overallAverage =
          (fanAverage * 1.0 +
            mediaAverage * 2.0 +
            battlerAverage * 2.5 +
            leagueOwnerAverage * 3.0) /
          8.5;

        mockData.push({
          battlerId: battler.id,
          category,
          attribute,
          overallAverage,
          fanAverage,
          mediaAverage,
          battlerAverage,
          leagueOwnerAverage,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  return mockData;
}

// Client-side mock data functions
export function getMockRoleWeights(): RoleWeight[] {
  // Try to get from localStorage first
  const storedWeights = localStorage.getItem("mockRoleWeights");
  if (storedWeights) {
    try {
      return JSON.parse(storedWeights);
    } catch (e) {
      console.error("Error parsing stored role weights:", e);
    }
  }

  // Return defaults if nothing in localStorage
  return defaultRoleWeights;
}

export function updateMockRoleWeight(
  role: RoleKey,
  weight: number,
): { success: boolean; error?: Error } {
  try {
    const weights = getMockRoleWeights();
    const updatedWeights = weights.map((rw) => (rw.role === role ? { ...rw, weight } : rw));

    localStorage.setItem("mockRoleWeights", JSON.stringify(updatedWeights));
    return { success: true };
  } catch (e) {
    console.error(`Error updating weight for role ${role}:`, e);
    return { success: false, error: e as Error };
  }
}
export function resetMockRoleWeightsToDefault(): { success: boolean; error?: Error } {
  try {
    localStorage.setItem("mockRoleWeights", JSON.stringify(defaultRoleWeights));
    return { success: true };
  } catch (e) {
    console.error("Error resetting role weights:", e);
    return { success: false, error: e as Error };
  }
}
export function getMockBattlerAttributeAverages(
  battlerId: string,
  category?: string,
): BattlerAttribute[] {
  // Try to get from localStorage first
  const storedData = localStorage.getItem("mockBattlerAttributes");
  let mockData: BattlerAttribute[] = [];

  if (storedData) {
    try {
      mockData = JSON.parse(storedData);
    } catch (e) {
      console.error("Error parsing stored battler attributes:", e);
      mockData = generateMockRatings();
      localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData));
    }
  } else {
    mockData = generateMockRatings();
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData));
  }

  // Filter by battlerId and optionally by category
  return mockData.filter((item: BattlerAttribute) => {
    if (category) {
      return item.battlerId === battlerId && item.category === category;
    }
    return item.battlerId === battlerId;
  });
}

export function getMockTopBattlersByRole(
  role: RoleKey,
  category?: string,
  attribute?: string,
  limit = 10,
): BattlerAttribute[] {
  // Try to get from localStorage first
  const storedData = localStorage.getItem("mockBattlerAttributes");
  let mockData: BattlerAttribute[] = [];

  if (storedData) {
    try {
      mockData = JSON.parse(storedData);
    } catch (e) {
      console.error("Error parsing stored battler attributes:", e);
      mockData = generateMockRatings();
      localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData));
    }
  } else {
    mockData = generateMockRatings();
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData));
  }

  // Select the appropriate average column based on role
  let averageColumn = "overallAverage";
  switch (role) {
    case "fan":
      averageColumn = "fanAverage";
      break;
    case "media":
      averageColumn = "mediaAverage";
      break;
    case "battler":
      averageColumn = "battlerAverage";
      break;
    case "league_owner":
      averageColumn = "leagueOwnerAverage";
      break;
  }

  // Filter by category and attribute if provided
  let filteredData = mockData;
  if (category) {
    filteredData = filteredData.filter((item: BattlerAttribute) => item.category === category);
  }
  if (attribute) {
    filteredData = filteredData.filter((item: BattlerAttribute) => item.attribute === attribute);
  }

  // Sort by the selected average column
  filteredData.sort(
    (a: BattlerAttribute, b: BattlerAttribute) =>
      (b[averageColumn as keyof BattlerAttribute] as number) -
      (a[averageColumn as keyof BattlerAttribute] as number),
  );
  // Limit the results
  filteredData = filteredData.slice(0, limit);

  // Join with battler data
  return filteredData.map((item: BattlerAttribute) => {
    const battler = mockBattlers.find((b) => b.id.toString() === item.battlerId);
    const rating = item[averageColumn as keyof BattlerAttribute];
    return {
      ...item,
      battlerName: battler?.name || "Unknown",
      battlerImage: battler?.image || "",
      battlerLocation: battler?.location || "",
      rating: typeof rating === "number" ? rating : undefined,
    };
  });
}

// Function to regenerate all mock analytics data
export function regenerateMockAnalyticsData(): { success: boolean; error?: Error } {
  try {
    const mockData = generateMockRatings();
    localStorage.setItem("mockBattlerAttributes", JSON.stringify(mockData));
    return { success: true };
  } catch (e) {
    console.error("Error generating mock analytics data:", e);
    return { success: false, error: e as Error };
  }
}
