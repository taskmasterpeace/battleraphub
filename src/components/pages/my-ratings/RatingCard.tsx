import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, XCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RatingButton } from "@/components/pages/my-ratings/RatingButton";
import { MyRating } from "@/types";

const RatingCard = ({ rating }: { rating: MyRating }) => {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={rating?.avatar || "/placeholder.svg"}
                  alt={rating?.name || "Battler Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Link
                  href={`/battlers/${rating?.battler_id}`}
                  className="text-lg font-medium hover:text-purple-400"
                >
                  {rating?.name || "Battler Name"}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{rating.average_score.toFixed(2)}</span>
                  <span className="text-sm text-gray-400">
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
                      item.props.className.includes("bg-green-900"),
                    ).length;
                    const negativeCount = acc.filter((item) =>
                      item.props.className.includes("bg-red-900"),
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
                            ? "bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/30"
                            : "bg-red-900/30 text-red-400 border-red-700 hover:bg-red-900/30"
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
                <Link href={`/battlers/${rating?.battler_id}`}>View Battler</Link>
              </RatingButton>
              <RatingButton variant="outline" size="sm">
                <Link href={`/battlers/${rating?.battler_id}`}>Edit Rating</Link>
              </RatingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RatingCard;
