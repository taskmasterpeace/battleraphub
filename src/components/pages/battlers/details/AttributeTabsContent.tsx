import { ChartConfig } from "@/types";
import AttributeSlider from "@/components/pages/battlers/details/AttributeSlider";
import BadgeSection from "@/components/pages/battlers/details/BadgeSection";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Bar,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useBattler } from "@/contexts/battler.context";
import { ATTRIBUTE_CATEGORIES, CATEGORY_TYPES } from "@/config";
import { colorOptions, generateComparisonChartData } from "@/lib/static/static-data";
import { useAuth } from "@/contexts/auth.context";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/lib/static/framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart } from "lucide-react";
import { useMemo } from "react";

interface TabContentProps {
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  colorText: string;
  value: (typeof ATTRIBUTE_CATEGORIES)[keyof typeof ATTRIBUTE_CATEGORIES];
}

export const AttributeTabsContent = ({
  title,
  description,
  gradientFrom,
  gradientTo,
  colorText,
  value,
}: TabContentProps) => {
  const { attributes, badges, ratings, selectedBadges, handleRatingChange, handleBadgeSelect } =
    useBattler();

  const categoryAttributes = useMemo(
    () => attributes?.filter((attr) => attr.category === value),
    [attributes, value],
  );

  const positiveCategoryBadges = useMemo(() => {
    return badges
      ?.filter((badge) => badge.category === value && badge.is_positive)
      .map((badge) => ({ badge: badge.name, description: badge.description }));
  }, [badges, value]);

  const negativeCategoryBadges = useMemo(() => {
    return badges
      ?.filter((badge) => badge.category === value && !badge.is_positive)
      .map((badge) => ({ badge: badge.name, description: badge.description }));
  }, [badges, value]);

  const { user } = useAuth();
  const userId = user?.id;
  const { battlerAnalytics, battlerRatings, chartType, toggleChartType } = useBattler();

  const chartConfig: ChartConfig = {
    categoryTypes: Object.values(CATEGORY_TYPES),
    colorOptions,
    attributes: categoryAttributes,
  };

  // TODO: Needs improvement
  const comparisonData = generateComparisonChartData(
    battlerAnalytics,
    battlerRatings,
    chartConfig,
    "community-score",
    "rating-score",
  );

  // Get the section from the title
  const getSection = (): "writing" | "performance" | "personal" => {
    if (title.toLowerCase().includes("writing")) return "writing";
    if (title.toLowerCase().includes("performance")) return "performance";
    return "personal";
  };

  const section = getSection();

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <div className="mb-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2
              className={`text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-${colorText}`}
            >
              {title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleChartType(section)}
            className={`border-${colorText} text-${colorText} hover:bg-[#${colorText}]/10`}
          >
            {chartType[section] === "radar" ? (
              <>
                <BarChart2 className="h-4 w-4 mr-2" /> Bar Chart
              </>
            ) : (
              <>
                <PieChart className="h-4 w-4 mr-2" /> Radar Chart
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="space-y-3" variants={staggerContainer}>
            {categoryAttributes.map((attr) => (
              <motion.div key={attr.id} variants={slideUp} transition={{ duration: 0.3 }}>
                <AttributeSlider
                  title={attr.name}
                  description={attr.description || ""}
                  value={ratings?.[attr.id]?.score}
                  onChange={(value) => handleRatingChange(attr.id, value)}
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                  colorText={colorText}
                />
              </motion.div>
            ))}
          </motion.div>
          <div>
            {Object.values(comparisonData).map(
              (item, index) =>
                item.data.length > 0 && (
                  <Card key={index}>
                    <CardContent className="pb-0">
                      <ChartContainer width="100%" height={262}>
                        {chartType[section] === "radar" ? (
                          <RadarChart data={item.data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <Tooltip
                              content={({ active, payload }) =>
                                active &&
                                payload &&
                                payload.length && (
                                  <ChartTooltip className="p-2 rounded bg-muted">
                                    <ChartTooltipContent>
                                      {payload.map((entry, index) => (
                                        <div key={`tooltip-${index}`}>
                                          {entry.name}: {entry.value}
                                        </div>
                                      ))}
                                    </ChartTooltipContent>
                                  </ChartTooltip>
                                )
                              }
                            />
                            {userId && (
                              <Radar
                                name="My Rating"
                                dataKey="rating-score"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                strokeWidth={3}
                                fillOpacity={0.9}
                              />
                            )}
                            <Radar
                              name="Community Rating"
                              dataKey="community-score"
                              stroke="hsl(var(--success))"
                              strokeWidth={3}
                              fill="hsl(var(--success))"
                              fillOpacity={0.5}
                            />
                          </RadarChart>
                        ) : (
                          <BarChart data={item.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              content={({ active, payload }) =>
                                active &&
                                payload &&
                                payload.length && (
                                  <ChartTooltip className="p-2 rounded bg-muted">
                                    <ChartTooltipContent>
                                      {payload.map((entry, index) => (
                                        <div key={`tooltip-${index}`}>
                                          {entry.name}: {entry.value}
                                        </div>
                                      ))}
                                    </ChartTooltipContent>
                                  </ChartTooltip>
                                )
                              }
                            />
                            {userId && (
                              <Bar
                                name="My Rating"
                                dataKey="community-score"
                                fill={`hsl(var(--primary))`}
                              />
                            )}
                            <Bar
                              name="Community Rating"
                              dataKey="rating-score"
                              fill="hsl(var(--success))"
                            />
                          </BarChart>
                        )}
                      </ChartContainer>
                      <CardFooter className="flex items-center justify-center gap-4">
                        {userId && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-1.5 rounded-sm bg-primary"></div>
                            <span className="text-sm">My Rating</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1.5 rounded-sm bg-success"></div>
                          <span className="text-sm">Community Rating</span>
                        </div>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ),
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold my-4">{title} Badges</h3>
        <div className="space-y-8">
          <BadgeSection
            title="Positive"
            badges={positiveCategoryBadges}
            isPositive={true}
            selectedBadges={selectedBadges.positive}
            onSelectBadge={handleBadgeSelect}
          />
          <BadgeSection
            title="Negative"
            badges={negativeCategoryBadges}
            isPositive={false}
            selectedBadges={selectedBadges.negative}
            onSelectBadge={handleBadgeSelect}
          />
        </div>
      </div>
    </motion.div>
  );
};
