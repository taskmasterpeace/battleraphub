"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, Attribute } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { ATTRIBUTE_CATEGORIES, DB_TABLES } from "@/config";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";
import { TabsContent } from "@/components/ui/tabs";
import { AttributeTabsContent } from "@/components/pages/battlers/details/AttributeTabsContent";
import { useBattler } from "@/contexts/battler.context";

const supabase = createClient();

export interface AttributesTabProps {
  updateBadges: (badges: { positive: string[]; negative: string[] }) => void;
  attributeData: Attribute[];
  badgeData: Badge[];
  battlerId: string;
}

export default function AttributesTab({
  updateBadges,
  attributeData,
  badgeData,
  battlerId,
}: AttributesTabProps) {
  const { battlerBadges, battlerRatings } = useBattler();
  const [ratings, setRatings] = useState<Record<string, { id: string; score: number }>>({});
  const [selectedBadges, setSelectedBadges] = useState<{
    positive: string[];
    negative: string[];
  }>({
    positive: [],
    negative: [],
  });

  // State for badges and attributes
  const [writingBadges, setWritingBadges] = useState<Badge[]>([]);
  const [performanceBadges, setPerformanceBadges] = useState<Badge[]>([]);
  const [personalBadges, setPersonalBadges] = useState<Badge[]>([]);

  const [writingAttributes, setWritingAttributes] = useState<Attribute[]>([]);
  const [performanceAttributes, setPerformanceAttributes] = useState<Attribute[]>([]);
  const [personalAttributes, setPersonalAttributes] = useState<Attribute[]>([]);

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (battlerBadges.length > 0) {
      const badgeIds = battlerBadges.map((bb) => bb.badge_id);

      const filterBadgeData = badgeData.filter((badge) => badgeIds.includes(badge.id));
      if (filterBadgeData) {
        const positive = filterBadgeData.filter((b) => b.is_positive).map((b) => b.name);
        const negative = filterBadgeData.filter((b) => !b.is_positive).map((b) => b.name);
        setSelectedBadges({ positive, negative });
      }
    }
  }, [badgeData, battlerBadges]);

  useEffect(() => {
    if (battlerRatings.length > 0) {
      const ratingMap: Record<string, { id: string; score: number }> = {};
      battlerRatings.forEach((rating) => {
        ratingMap[rating.attribute_id] = {
          id: rating.id,
          score: Number(rating.score),
        };
      });
      setRatings(ratingMap);
    }
  }, [battlerRatings]);

  useEffect(() => {
    const writingBadges = badgeData.filter(
      (badge) => badge.category === ATTRIBUTE_CATEGORIES.WRITING,
    );
    const performanceBadges = badgeData.filter(
      (badge) => badge.category === ATTRIBUTE_CATEGORIES.PERFORMANCE,
    );
    const personalBadges = badgeData.filter(
      (badge) => badge.category === ATTRIBUTE_CATEGORIES.PERSONAL,
    );
    setWritingBadges(writingBadges);
    setPerformanceBadges(performanceBadges);
    setPersonalBadges(personalBadges);

    const writingAttrs = attributeData.filter(
      (attr) => attr.category === ATTRIBUTE_CATEGORIES.WRITING,
    );
    const performanceAttrs = attributeData.filter(
      (attr) => attr.category === ATTRIBUTE_CATEGORIES.PERFORMANCE,
    );
    const personalAttrs = attributeData.filter(
      (attr) => attr.category === ATTRIBUTE_CATEGORIES.PERSONAL,
    );

    setWritingAttributes(writingAttrs);
    setPerformanceAttributes(performanceAttrs);
    setPersonalAttributes(personalAttrs);
  }, [attributeData, badgeData]);

  const handleRatingChange = async (attributeId: number, value: number) => {
    if (!userId) return null;
    try {
      const existingRating = ratings[attributeId];
      const { error, data } = await supabase
        .from(DB_TABLES.BATTLER_RATINGS)
        .upsert({
          ...existingRating,
          user_id: userId,
          battler_id: battlerId,
          attribute_id: attributeId,
          score: value,
        })
        .select();

      if (error) {
        toast.error("Error saving rating");
        return;
      }

      if (data.length) {
        setRatings((prev) => ({
          ...prev,
          [attributeId]: {
            id: data[0].id,
            score: value,
          },
        }));
      } else {
        toast.error("Error saving rating");
        return;
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save rating");
    }
  };

  const saveBadges = async (badgeId: string) => {
    try {
      const { error } = await supabase.from(DB_TABLES.BATTLER_BADGES).insert({
        user_id: userId,
        battler_id: battlerId,
        badge_id: badgeId,
      });

      if (error) {
        toast.error("Error saving badge");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error saving badge:", error);
      return false;
    }
  };

  const removeBadges = async (badgeId: string) => {
    try {
      const { error } = await supabase
        .from(DB_TABLES.BATTLER_BADGES)
        .delete()
        .eq("user_id", userId)
        .eq("battler_id", battlerId)
        .eq("badge_id", badgeId);

      if (error) {
        toast.error("Error removing badge");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error removing badge:", error);
      return false;
    }
  };

  const handleBadgeSelect = async (badge: string, isPositive: boolean) => {
    if (!userId) return null;
    const allBadges = [...writingBadges, ...performanceBadges, ...personalBadges];
    const badgeObj = allBadges.find((b) => b.name === badge);

    if (!badgeObj || !badgeObj.id) return;

    const type = isPositive ? "positive" : "negative";
    const isSelected = selectedBadges[type].includes(badge);

    if (isSelected) {
      const success = await removeBadges(badgeObj.id.toString());
      if (success) {
        setSelectedBadges((prev) => ({
          ...prev,
          [type]: prev[type].filter((b) => b !== badge),
        }));
      }
    } else {
      const success = await saveBadges(badgeObj.id.toString());
      if (success) {
        setSelectedBadges((prev) => ({
          ...prev,
          [type]: [...prev[type], badge],
        }));
      }
    }
  };

  useEffect(() => {
    updateBadges(selectedBadges);
  }, [selectedBadges, updateBadges]);

  return (
    <div>
      <Tabs defaultValue="writing">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="writing">Writing</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        {[
          {
            value: "writing",
            title: "Writing",
            description: "Ability to write impactful and complex rhymes",
            attributes: writingAttributes,
            badges: writingBadges,
            gradientFrom: "indigo-500",
            gradientTo: "purple-500",
          },
          {
            value: "performance",
            title: "Performance",
            description: "Delivery, cadence, and stage presence",
            attributes: performanceAttributes,
            badges: performanceBadges,
            gradientFrom: "blue-500",
            gradientTo: "cyan-500",
          },
          {
            value: "personal",
            title: "Personal",
            description: "Character, reputation, and battle approach",
            attributes: personalAttributes,
            badges: personalBadges,
            gradientFrom: "amber-500",
            gradientTo: "orange-500",
          },
        ].map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <AttributeTabsContent
              title={tab.title}
              description={tab.description}
              attributes={tab.attributes}
              badges={tab.badges}
              ratings={ratings}
              selectedBadges={selectedBadges}
              handleRatingChange={handleRatingChange}
              handleBadgeSelect={handleBadgeSelect}
              gradientFrom={tab.gradientFrom}
              gradientTo={tab.gradientTo}
            />
          </TabsContent>
        ))}
      </Tabs>{" "}
    </div>
  );
}
