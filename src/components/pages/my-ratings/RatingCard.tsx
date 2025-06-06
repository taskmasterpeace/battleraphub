import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RatingButton } from "@/components/pages/my-ratings/RatingButton";
import { MyRating } from "@/types";
import { PAGES } from "@/config";

const RatingCard = ({ rating }: { rating: MyRating }) => {
  return (
    <>
      <Card>
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={rating?.avatar || "/placeholder.svg"}
                  alt={rating?.name || "Battler Avatar"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Link
                  href={`${PAGES.BATTLERS}/${rating?.battler_id}`}
                  className="text-lg font-medium hover:text-purple-400"
                >
                  {rating?.name || "Battler Name"}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{rating.average_score.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">
                    • Rated on {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-wrap gap-2">
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
                            ? "bg-success-foreground dark:bg-success/20 text-success border-success hover:bg-success-foreground"
                            : "bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive hover:bg-destructive-foreground"
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

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <RatingButton variant="outline" size="sm">
                <Link href={`${PAGES.BATTLERS}/${rating?.battler_id}`}>View Battler</Link>
              </RatingButton>
              <RatingButton variant="outline" size="sm">
                <Link href={`${PAGES.BATTLERS}/${rating?.battler_id}`}>Edit Rating</Link>
              </RatingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RatingCard;
