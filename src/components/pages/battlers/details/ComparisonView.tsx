"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Attribute, TopAssignBadgeByBattler } from "@/types";
import { fadeIn, slideUp } from "@/lib/static/framer-motion";
import DetailedComparison from "./DetailedComparison";
import Link from "next/link";
import { useBattler } from "@/contexts/battler.context";
import { supabase } from "@/utils/supabase/client";
import { MATERIALIZED_VIEWS, PAGES } from "@/config";
import useSWR from "swr";
import { getComparisonColorClass, getComparisonIndicator } from "@/lib/static/static-data";
import { ATTRIBUTE_CATEGORIES } from "@/config";
import { useEffect, useState } from "react";

export default function ComparisonView() {
  // Store ratingMaps for current and comparison battler for each category
  const [ratingMaps, setRatingMaps] = useState<{ [key: string]: { [key: string]: Attribute[] } }>(
    {},
  );
  const {
    topBadgesAssignedByBattler,
    totalRatings,
    selectedBattlerAnalytics,
    battlerAnalytics,
    selectedBattlerTotalRatings,
    selectedBattler,
    battlerData: currentBattler,
    attributes,
  } = useBattler();

  useEffect(() => {
    if (!attributes.length) return;
    if (!battlerAnalytics.length || !selectedBattlerAnalytics.length) return;

    const ratingMaps: { [key: string]: { [key: string]: Attribute[] } } = {};

    const currentBattlerRatingMap: Record<string, number> = {};
    battlerAnalytics.forEach((rating) => {
      currentBattlerRatingMap[rating.attribute_id] = Number(rating.score);
    });

    const comparisonBattlerRatingMap: Record<string, number> = {};
    selectedBattlerAnalytics.forEach((rating) => {
      comparisonBattlerRatingMap[rating.attribute_id] = Number(rating.score);
    });

    Object.values(ATTRIBUTE_CATEGORIES).forEach((category) => {
      const categoryAttributes = attributes.filter((attr) => attr.category === category);
      const currentBattlerCategoryRatingMap = categoryAttributes.map((attr) => {
        return {
          ...attr,
          value: currentBattlerRatingMap[attr.id],
        };
      });

      const comparisonBattlerCategoryRatingMap = categoryAttributes.map((attr) => {
        return {
          ...attr,
          value: comparisonBattlerRatingMap[attr.id],
        };
      });

      ratingMaps[category] = {
        currentBattler: currentBattlerCategoryRatingMap,
        comparisonBattler: comparisonBattlerCategoryRatingMap,
      };
    });

    setRatingMaps(ratingMaps);
  }, [battlerAnalytics, selectedBattlerAnalytics, attributes]);

  // strength and  weakness of comparison battlers data
  const { data: topCompareStrengthsAndWeakness = [] } = useSWR(
    selectedBattler?.id ? `topBadgesAssignedByBattler/${selectedBattler?.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from(MATERIALIZED_VIEWS.TOP_ASSIGNED_BADGES_BY_BATTLERS)
        .select("*")
        .eq("battler_id", selectedBattler?.id);

      if (error) throw error;
      return data as TopAssignBadgeByBattler[];
    },
  );

  function calculateOverallScore(attributes: Attribute[]): number {
    if (!attributes?.length) return 0;
    const total = attributes.reduce((sum, attr) => sum + (attr.value ?? 0), 0);
    return parseFloat((total / attributes.length).toFixed(1));
  }

  const currentWritingScore = calculateOverallScore(ratingMaps?.writing?.currentBattler);
  const comparisonWritingScore = calculateOverallScore(ratingMaps?.writing?.comparisonBattler);

  const currentPerformanceScore = calculateOverallScore(ratingMaps?.performance?.currentBattler);
  const comparisonPerformanceScore = calculateOverallScore(
    ratingMaps?.performance?.comparisonBattler,
  );

  const currentPersonalScore = calculateOverallScore(ratingMaps?.personal?.currentBattler);
  const comparisonPersonalScore = calculateOverallScore(ratingMaps?.personal?.comparisonBattler);

  const currentOverallScore =
    (currentWritingScore + currentPerformanceScore + currentPersonalScore) / 3;

  const comparisonOverallScore =
    (comparisonWritingScore + comparisonPerformanceScore + comparisonPersonalScore) / 3;

  const totalScore = currentOverallScore + comparisonOverallScore;
  const currentUsersWinChance = totalScore === 0 ? 50 : (currentOverallScore / totalScore) * 100;
  const comparisonUsersWinChance =
    totalScore === 0 ? 50 : (comparisonOverallScore / totalScore) * 100;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      {/* Overall Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-background border border-border rounded-lg p-6 text-center"
          variants={slideUp}
        >
          <h3 className="text-lg font-medium mb-2 text-muted-foreground">Overall Rating</h3>
          <div className="flex items-center justify-center gap-4">
            <div>
              <div className="text-3xl font-bold">{totalRatings.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">{currentBattler?.name}</div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-3xl font-bold">{selectedBattlerTotalRatings.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">{selectedBattler?.name}</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center">
            {getComparisonIndicator(totalRatings, selectedBattlerTotalRatings)}
            <span className={getComparisonColorClass(totalRatings, selectedBattlerTotalRatings)}>
              {Math.abs(totalRatings - selectedBattlerTotalRatings).toFixed(1)} difference
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-background border border-border rounded-lg p-6"
          variants={slideUp}
        >
          <h3 className="text-lg font-medium mb-4 text-center text-muted-foreground">
            Category Scores
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-primary">Writing</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted">{currentWritingScore.toFixed(1)}</Badge>
                <span className="text-muted-foreground">vs</span>
                <Badge className="bg-muted">{comparisonWritingScore.toFixed(1)}</Badge>
                {getComparisonIndicator(currentWritingScore, comparisonWritingScore)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-success">Performance</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted">{currentPerformanceScore.toFixed(1)}</Badge>
                <span className="text-muted-foreground">vs</span>
                <Badge className="bg-muted">{comparisonPerformanceScore.toFixed(1)}</Badge>
                {getComparisonIndicator(currentPerformanceScore, comparisonPerformanceScore)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400">Personal</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted">{currentPersonalScore.toFixed(1)}</Badge>
                <span className="text-muted-foreground">vs</span>
                <Badge className="bg-muted">{comparisonPersonalScore.toFixed(1)}</Badge>
                {getComparisonIndicator(currentPersonalScore, comparisonPersonalScore)}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-background border border-border rounded-lg p-6"
          variants={slideUp}
        >
          <h3 className="text-lg font-medium mb-4 text-center text-muted-foreground">
            Strengths & Weaknesses
          </h3>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">{`${currentBattler?.name}'s Strength`}</div>
              <div className="text-white font-medium">
                {topBadgesAssignedByBattler
                  .filter((item) => item.is_positive)
                  .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))[0]?.badge_name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{`${currentBattler?.name}'s Weakness`}</div>
              <div className="text-white font-medium">
                {topBadgesAssignedByBattler
                  .filter((item) => !item.is_positive)
                  .sort((a, b) => (a.percentage ?? 0) - (b.percentage ?? 0))[0]?.badge_name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {selectedBattler?.name}'s Strength
              </div>
              <div className="text-white font-medium">
                {topCompareStrengthsAndWeakness
                  .filter((item) => item.is_positive)
                  .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))[0]?.badge_name || "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {selectedBattler?.name}'s Weakness
              </div>
              <div className="text-white font-medium">
                {topCompareStrengthsAndWeakness
                  .filter((item) => !item.is_positive)
                  .sort((a, b) => (a.percentage ?? 0) - (b.percentage ?? 0))[0]?.badge_name || "-"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Comparison */}
      <div className="rounded-lg p-6">
        <Tabs defaultValue={ATTRIBUTE_CATEGORIES.WRITING} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="">
              <TabsTrigger
                value={ATTRIBUTE_CATEGORIES.WRITING}
                className="data-[state=active]:text-primary"
              >
                Writing
              </TabsTrigger>
              <TabsTrigger
                value={ATTRIBUTE_CATEGORIES.PERFORMANCE}
                className="data-[state=active]:text-success"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value={ATTRIBUTE_CATEGORIES.PERSONAL}
                className="data-[state=active]:text-amber-400"
              >
                Personal
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={ATTRIBUTE_CATEGORIES.WRITING} className="mt-0">
            <DetailedComparison
              currentBattler={currentBattler?.name || ""}
              comparisonBattler={selectedBattler?.name || ""}
              currentData={ratingMaps?.writing?.currentBattler || []}
              comparisonData={ratingMaps?.writing?.comparisonBattler || []}
              color="purple"
            />
          </TabsContent>

          <TabsContent value={ATTRIBUTE_CATEGORIES.PERFORMANCE} className="mt-0">
            <DetailedComparison
              currentBattler={currentBattler?.name || ""}
              comparisonBattler={selectedBattler?.name || ""}
              currentData={ratingMaps?.performance?.currentBattler || []}
              comparisonData={ratingMaps?.performance?.comparisonBattler || []}
              color="green"
            />
          </TabsContent>

          <TabsContent value={ATTRIBUTE_CATEGORIES.PERSONAL} className="mt-0">
            <DetailedComparison
              currentBattler={currentBattler?.name || ""}
              comparisonBattler={selectedBattler?.name || ""}
              currentData={ratingMaps?.personal?.currentBattler || []}
              comparisonData={ratingMaps?.personal?.comparisonBattler || []}
              color="amber"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Battle Prediction */}
      <motion.div
        className="mt-8 bg-accent border border-border rounded-lg p-6 text-center"
        variants={slideUp}
      >
        <h3 className="text-xl font-medium mb-4 text-muted-foreground">Battle Prediction</h3>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{currentUsersWinChance.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">{currentBattler?.name}</div>
          </div>
          <div className="text-2xl text-muted-foreground">vs</div>
          <div className="text-center">
            <div className="text-4xl font-bold">{comparisonUsersWinChance.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">{selectedBattler?.name}</div>
          </div>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto mb-4">
          Prediction based on historical performance data, style matchup analysis, and attribute
          compatibility.
        </p>
        <Link
          href={PAGES.ANALYTICS}
          className="text-primary-foreground rounded-md h-10 px-4 py-2 bg-muted-foreground hover:bg-accent border hover:border-muted-foreground"
        >
          View Detailed Analysis
        </Link>
      </motion.div>
    </motion.div>
  );
}
