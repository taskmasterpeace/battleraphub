"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { getUserBadges } from "@/app/actions";
import { UserBadge } from "@/types";

interface UserBadgesSectionProps {
  userId: string;
}

export default function UserBadgesSection({ userId }: UserBadgesSectionProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await getUserBadges(userId);
        setBadges(data);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  // Group badges by category
  const groupedBadges = badges.reduce<
    Record<string, { positive: UserBadge[]; negative: UserBadge[] }>
  >((acc, badge) => {
    const category = badge.badges.category ?? "writing";
    if (!acc[category]) {
      acc[category] = { positive: [], negative: [] };
    }

    if (badge.badges.is_positive) {
      acc[category].positive.push(badge);
    } else {
      acc[category].negative.push(badge);
    }

    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Badges</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0 h-48 bg-muted animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(groupedBadges).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No badges yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedBadges).map(([category, { positive, negative }]) => (
            <Card key={category}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{category}</h3>

                {positive.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-success flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Positive
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {positive.map((badge) => (
                        <Badge
                          key={badge.id}
                          className="bg-success-foreground dark:bg-success/20 text-success border-success"
                          title={badge.badges.description}
                        >
                          {badge.badges.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {negative.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-destructive flex items-center mb-2">
                      <XCircle className="w-4 h-4 mr-1" />
                      Negative
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {negative.map((badge) => (
                        <Badge
                          key={badge.id}
                          className="bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive"
                          title={badge.badges.description}
                        >
                          {badge.badges.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}{" "}
    </div>
  );
}
