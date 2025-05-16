"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, BarChart2 } from "lucide-react";
import { useLeaderboard } from "@/contexts/leaderboard.context";
import { Contributor } from "@/types";

export default function TopContributorCards() {
  const {
    mostConsistentUsers,
    mostInfluentialUsers,
    mostAccurateUsers,
    mostConsistentUsersLoading,
    mostInfluentialUsersLoading,
    mostAccurateUsersLoading,
  } = useLeaderboard();

  const highestRatedData = useMemo(
    () => [
      {
        title: "Most Consistent Ratings",
        description: "Provides highly consistent ratings across all battlers",
        data: mostConsistentUsers.slice(0, 1),
      },
      {
        title: "Most Active Reviewer",
        description: "Highest number of active reviews in the past month",
        data: mostAccurateUsers.slice(0, 1),
      },
      {
        title: "Community Influencer",
        description: "Ratings that most closely align with community consensus",
        data: mostInfluentialUsers.slice(0, 1),
      },
    ],
    [mostAccurateUsers, mostConsistentUsers, mostInfluentialUsers],
  );

  if (mostConsistentUsersLoading || mostInfluentialUsersLoading || mostAccurateUsersLoading) {
    return [...Array(3)].map((_, i) => (
      <div key={i} className="grid grid-cols-1 mb-4 w-full">
        <Card className="w-full animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
            </CardTitle>
            <CardDescription>
              <div className="h-3 bg-muted rounded w-48 animate-pulse"></div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted animate-pulse"></div>
              <div>
                <div className="h-4 bg-muted rounded w-24 animate-pulse mb-1"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ));
  }

  const getIcon = (index: number) => {
    const icons = [
      <BarChart2 key="chart" className="h-5 w-5 text-blue-500" />,
      <TrendingUp key="trend" className="h-5 w-5 text-success" />,
      <Award key="award" className="h-5 w-5 text-purple-500" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {highestRatedData.map((contributor: Contributor, index: number) => {
        const userData = contributor.data[0];
        if (!userData) return null;

        return (
          <Card key={`${contributor.title}-${userData.user_id}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                {getIcon(index)}
                {contributor.title}
              </CardTitle>
              <CardDescription>{contributor.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/profile/${userData?.user_id}`}
                    className="font-medium text-lg hover:underline"
                  >
                    {userData.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    @{userData.name.split(" ").join("").toLowerCase()}
                  </p>
                  <div className="my-1 text-sm flex gap-2">
                    <span className="font-semibold">{userData.ratings_given?.toFixed(2) || 0}</span>
                    <span className="text-muted-foreground">Rating given by</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}{" "}
    </div>
  );
}
