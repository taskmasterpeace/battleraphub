"use client";

import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import AttributesTab from "@/components/pages/battlers/details/AttributesTab";
import AnalyticsTab from "@/components/pages/battlers/details/AnalyticsTab";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import { Attribute, Badge as badgesType, Battlers } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useBattler } from "@/contexts/battler.context";

const supabase = createClient();

interface BattlerDetailsProps {
  params: Promise<{ id: string }>;
  badgeData: badgesType[];
  attributeData: Attribute[];
}

export default function BattlerPage({ params, badgeData, attributeData }: BattlerDetailsProps) {
  const { id: battlerId } = use(params);
  const [battlerData, setBattlerData] = useState<Battlers>();
  const { totalRatings } = useBattler();
  const [selectedBadges, setSelectedBadges] = useState<{
    positive: string[];
    negative: string[];
  }>({
    positive: [],
    negative: [],
  });

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

  // Function to update badges (will be passed to AttributesTab)
  const updateBadges = async (badges: { positive: string[]; negative: string[] }) => {
    setSelectedBadges(badges);
  };

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
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-900 relative">
            <Image
              src={battlerData?.avatar || "/image/default-avatar-img.jpg"}
              alt={battlerData?.name || "NA"}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <h1 className="text-3xl font-bold cursor-pointer">{battlerData?.name}</h1>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-52 bg-background text-primary-foreground"
                  >
                    <div className="grid">
                      <div className="space-y-1">
                        <div className="text-md pl-2 pb-2 font-bold">Personal info</div>
                        <Separator orientation="horizontal" />
                        <div className="flex flex-col items-start">
                          <Button
                            variant="ghost"
                            className="flex justify-start items-center px-2 py-2 hover:bg-gray-800 rounded-md my-1 w-full"
                          >
                            Battler
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex justify-start px-2 py-2 hover:bg-gray-800 rounded-md w-full"
                          >
                            Users
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2"></div>
                    </div>
                  </PopoverContent>
                </Popover>

                <p className="text-gray-400 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {battlerData?.location}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {battlerData?.battler_tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded"
                    >
                      {tag?.tags?.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Total Rating</p>
                <p className="text-3xl font-bold text-purple-400">{totalRatings.toFixed(1)}</p>
              </div>
            </div>

            {/* Selected badges */}
            {(selectedBadges.positive.length > 0 || selectedBadges.negative.length > 0) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Selected Badges</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedBadges.positive.map((badge, index) => (
                    <div key={`${badge}-${index}`}>
                      <Badge className="px-3 py-2 text-base bg-green-900/30 text-green-400 border-green-700 hover:bg-green-900/30 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {badge}
                      </Badge>
                    </div>
                  ))}
                  {selectedBadges.negative.map((badge, index) => (
                    <div key={`${badge}-${index}`}>
                      <Badge className="px-3 py-2 text-base bg-red-900/30 text-red-400 border-red-700 hover:bg-red-900/30 flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        {badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attributes" className="mb-12">
          <TabsList className="mb-8 bg-gray-900 border border-gray-800">
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="attributes">
            <AttributesTab
              updateBadges={updateBadges}
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
