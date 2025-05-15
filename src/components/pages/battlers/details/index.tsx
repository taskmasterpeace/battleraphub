"use client";

import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, MapPin } from "lucide-react";
import AttributesTab from "@/components/pages/battlers/details/AttributesTab";
import AnalyticsTab from "@/components/pages/battlers/details/AnalyticsTab";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import { Attribute, Badge as badgesType, Battlers } from "@/types";
import { useBattler } from "@/contexts/battler.context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BattlerDetailsProps {
  params: Promise<{ id: string }>;
  badgeData: badgesType[];
  attributeData: Attribute[];
}

export default function BattlerPage({ params, badgeData, attributeData }: BattlerDetailsProps) {
  const { id: battlerId } = use(params);
  const [battlerData, setBattlerData] = useState<Battlers>();
  const { totalRatings, topBadgesAssignedByBattler } = useBattler();

  const fetchBattlerData = useCallback(async () => {
    try {
      const { data: battlers, error: battlerError } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select(
          `*, 
          battler_tags (
            tags (
              id,
              name
            )
          )
        `,
        )
        .eq("id", battlerId)
        .eq("battler_tags.battler_id", battlerId);

      if (battlerError) {
        toast.error("Failed to fetch battler data");
        return;
      }

      if (!battlers?.length) {
        toast.error("Battler not found");
        return;
      }

      setBattlerData(battlers[0] || []);
    } catch (error) {
      toast.error("Battler fetch error");
      console.log("error", error);
    }
  }, [battlerId]);

  useEffect(() => {
    fetchBattlerData();
  }, [fetchBattlerData]);

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-48 relative">
        <Image
          src={battlerData?.banner || "/placeholder.svg"}
          alt={`${battlerData?.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-border relative">
            <Image
              src={battlerData?.avatar || "/image/default-avatar-img.jpg"}
              alt={battlerData?.name || "NA"}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex justify-between items-center gap-2">
                <div>
                  <h1 className="text-3xl font-bold">{battlerData?.name}</h1>

                  <p className="text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {battlerData?.location}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {battlerData?.battler_tags?.map((tag, index) => (
                      <Badge key={index} className="text-xs px-2 py-0.5 rounded">
                        {tag?.tags?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="md:hidden bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Total Rating</p>
                  <p className="text-3xl font-bold text-primary">{totalRatings.toFixed(1)}</p>
                </div>
              </div>
              <div className="hidden md:block bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Rating</p>
                <p className="text-3xl font-bold text-primary">{totalRatings.toFixed(1)}</p>
              </div>
            </div>
            {/* Selected badges  */}
            {(topBadgesAssignedByBattler.some((badge) => badge.is_positive) ||
              topBadgesAssignedByBattler.some((badge) => !badge.is_positive)) && (
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Top Assigned Badges</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        most commonly assigned badges by users.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex flex-wrap gap-3">
                  {topBadgesAssignedByBattler
                    .filter((badge) => badge.is_positive)
                    .map((badge, index) => (
                      <TooltipProvider key={`${badge.badge_name}-${index}`}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger>
                            <Badge className="px-3 py-2 text-base bg-success-foreground dark:bg-success/20 text-success border-success hover:bg-success-foreground flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {`${badge.badge_name} (${badge.percentage}%)`}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="p-2">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  {topBadgesAssignedByBattler
                    .filter((badge) => !badge.is_positive)
                    .map((badge, index) => (
                      <TooltipProvider key={`${badge.badge_name}-${index}`}>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger>
                            <Badge className="px-3 py-2 text-base bg-destructive-foreground dark:bg-destructive/10 text-destructive border-destructive hover:bg-destructive-foreground flex items-center">
                              <XCircle className="w-4 h-4 mr-2" />
                              {`${badge.badge_name} (${badge.percentage}%)`}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="p-2">{badge.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attributes" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="attributes">
            <AttributesTab
              attributeData={attributeData}
              badgeData={badgeData}
              battlerId={battlerId}
            />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab battlerData={battlerData} attributeData={attributeData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
