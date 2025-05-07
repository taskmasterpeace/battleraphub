import { TopContributor } from "@/types";

export const topContributors: TopContributor[] = [
  {
    userId: "1",
    username: "jayblac",
    displayName: "Jay Blac",
    profileImage: "/placeholder.svg?height=400&width=400&text=Jay+Blac",
    contribution: "Most Consistent Ratings",
    score: 92,
    description: "Provides highly consistent ratings across all battlers",
  },
  {
    userId: "3",
    username: "queenzflip",
    displayName: "QueenzFlip",
    profileImage: "/placeholder.svg?height=400&width=400&text=QueenzFlip",
    contribution: "Most Active Reviewer",
    score: 203,
    description: "Highest number of active reviews in the past month",
  },
  {
    userId: "4",
    username: "15minutesoffame",
    displayName: "15 Minutes of Fame",
    profileImage: "/placeholder.svg?height=400&width=400&text=15MOF",
    contribution: "Community Influencer",
    score: 82,
    description: "Ratings that most closely align with community consensus",
  },
];
