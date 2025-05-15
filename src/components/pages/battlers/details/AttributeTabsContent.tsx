import { Attribute, Badge, ChartConfig } from "@/types";
import AttributeSlider from "@/components/pages/battlers/details/AttributeSlider";
import BadgeSection from "@/components/pages/battlers/details/BadgeSection";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useBattler } from "@/contexts/battler.context";
import { CATEGORY_TYPES } from "@/config";
import { colorOptions, generateComparisonChartData } from "@/lib/static/static-data";
import { useAuth } from "@/contexts/auth.context";

interface TabContentProps {
  title: string;
  description: string;
  attributes: Attribute[];
  badges: Badge[];
  ratings: Record<string, { id: string; score: number }>;
  selectedBadges: { positive: string[]; negative: string[] };
  handleRatingChange: (attributeId: number, value: number) => void;
  handleBadgeSelect: (badge: string, isPositive: boolean) => void;
  gradientFrom: string;
  gradientTo: string;
}

export const AttributeTabsContent = ({
  title,
  description,
  attributes,
  badges,
  ratings,
  selectedBadges,
  handleRatingChange,
  handleBadgeSelect,
  gradientFrom,
  gradientTo,
}: TabContentProps) => {
  const { user } = useAuth();
  const userId = user?.id;
  const { battlerAnalytics, battlerRatings } = useBattler();

  const chartConfig: ChartConfig = {
    categoryTypes: Object.values(CATEGORY_TYPES),
    colorOptions,
    attributes,
  };

  const comparisonData = generateComparisonChartData(
    battlerAnalytics,
    battlerRatings,
    chartConfig,
    "rating-score",
    "community-score",
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-muted-foreground mb-6">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="grid gap-3">
          {attributes.map((attr) => (
            <AttributeSlider
              key={attr.id}
              title={attr.name}
              description={attr.description || ""}
              value={ratings?.[attr.id]?.score}
              onChange={(value) => handleRatingChange(attr.id, value)}
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
            />
          ))}
        </div>
        <div>
          {Object.values(comparisonData).map(
            (item, index) =>
              item.data.length > 0 && (
                <Card key={index}>
                  <CardContent className="pb-0">
                    <ChartContainer width="100%" height={350}>
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
                            dataKey="community-score"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.9}
                          />
                        )}
                        <Radar
                          name="Community Rating"
                          dataKey="rating-score"
                          stroke="hsl(var(--success))"
                          fill="hsl(var(--success))"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
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

      <h3 className="text-xl font-semibold mb-4">{title} Badges</h3>
      <div className="space-y-8">
        <BadgeSection
          title="Positive"
          badges={badges
            .filter((b) => b.is_positive)
            .map((b) => ({ badge: b.name, description: b.description }))}
          isPositive={true}
          selectedBadges={selectedBadges.positive}
          onSelectBadge={handleBadgeSelect}
        />
        <BadgeSection
          title="Negative"
          badges={badges
            .filter((b) => !b.is_positive)
            .map((b) => ({ badge: b.name, description: b.description }))}
          isPositive={false}
          selectedBadges={selectedBadges.negative}
          onSelectBadge={handleBadgeSelect}
        />
      </div>
    </div>
  );
};
