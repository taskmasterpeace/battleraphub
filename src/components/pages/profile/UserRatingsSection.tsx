"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, CheckCircle, XCircle } from "lucide-react";
import { MyRating } from "@/types";
import { getUserRatings } from "@/app/actions";
import { formatDate } from "@/lib/utils";
import { PAGES } from "@/config";

interface UserRatingsSectionProps {
  userId: string;
}

export default function UserRatingsSection({ userId }: UserRatingsSectionProps) {
  const [ratings, setRatings] = useState<MyRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getUserRatings(userId);
        setRatings(data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ratings</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0 h-32 bg-muted animate-pulse"></CardContent>
            </Card>
          ))}
        </div>
      ) : ratings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No ratings yet</div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <Card key={index} className="overflow-hidden hover:border-amber-500 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`${PAGES.BATTLERS}/${rating.battler_id}`}
                    className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={rating.avatar || "/placeholder.svg"}
                      alt={rating.name || "Avatar"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`${PAGES.BATTLERS}/${rating.battler_id}`}
                          className="font-semibold text-lg hover:text-amber-400 transition-colors"
                        >
                          {rating.name}
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(rating.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center bg-amber-900/30 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                        <span className="font-bold">{rating.average_score.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {rating?.assigned_badges?.reduce(
                        (
                          acc: JSX.Element[],
                          badge: { name: string; is_positive: boolean },
                          index: number,
                        ) => {
                          const positiveCount = acc.filter((item) =>
                            item.props.className.includes("bg-success"),
                          ).length;
                          const negativeCount = acc.filter((item) =>
                            item.props.className.includes("bg-destructive"),
                          ).length;

                          if (
                            (badge?.is_positive && positiveCount >= 5) ||
                            (!badge?.is_positive && negativeCount >= 5)
                          ) {
                            return acc;
                          }

                          return [
                            ...acc,
                            <Badge
                              key={index}
                              className={`${
                                badge?.is_positive
                                  ? "bg-success-foreground dark:bg-success/20 text-success border-success"
                                  : "bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive"
                              } flex items-center`}
                            >
                              {badge?.is_positive ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {badge?.name}
                            </Badge>,
                          ];
                        },
                        [],
                      )}{" "}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
