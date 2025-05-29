import { ROLE, ROLES_NAME } from "@/config";

import { ChartConfig, ChartData, ComparisonChartData, Rating, rolesWeights } from "@/types";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

export const rolesWeightData: rolesWeights[] = [
  {
    id: 1,
    role_id: ROLE.FAN,
    formKey: "fan",
    key: ROLES_NAME[ROLE.FAN],
    label: "Fan",
    color: "orange",
    backgroundColor: "bg-orange-500",
    description: "Battle rap enthusiasts and viewers",
  },
  {
    id: 2,
    role_id: ROLE.MEDIA,
    formKey: "media",
    key: ROLES_NAME[ROLE.MEDIA],
    label: "Media",
    color: "purple",
    backgroundColor: "bg-primary",
    description: "Battle rap journalists, bloggers, and content creators",
  },
  {
    id: 3,
    role_id: ROLE.ARTIST,
    formKey: "battler",
    key: ROLES_NAME[ROLE.ARTIST],
    label: "Battler",
    color: "green",
    backgroundColor: "bg-success",
    description: "Active battle rappers",
  },
  {
    id: 4,
    role_id: ROLE.LEAGUE_OWNER_INVESTOR,
    formKey: "league_owner",
    key: ROLES_NAME[ROLE.LEAGUE_OWNER_INVESTOR],
    label: "League Owner",
    color: "amber",
    backgroundColor: "bg-amber-500",
    description: "Owners and operators of battle rap leagues",
  },
  {
    id: 5,
    role_id: ROLE.ADMIN,
    formKey: "admin",
    key: ROLES_NAME[ROLE.ADMIN],
    label: "Admin",
    color: "red",
    backgroundColor: "bg-destructive",
    description: "Platform administrators",
  },
];

export const colorOptions = ["#8884d8", "#82ca9d", "#ffc658"];

export const generateChartData = (ratingData: Rating[], config: ChartConfig): ChartData => {
  const { categoryTypes, colorOptions, attributes } = config;

  const data: ChartData = {};

  categoryTypes.forEach((category, index) => {
    data[category] = {
      title: category.charAt(0).toUpperCase() + category.slice(1),
      description: `${category} attributes ratings`,
      data: [],
      barColor: colorOptions[index] || "#000000",
    };
  });

  const attributeMapper = attributes.reduce(
    (acc, attr) => {
      acc[attr.id] = { name: attr.name, category: attr.category };
      return acc;
    },
    {} as { [key: number]: { name: string; category: string } },
  );

  ratingData.forEach((item) => {
    const attribute = attributeMapper[item.attribute_id];
    if (attribute && data[attribute.category]) {
      data[attribute.category].data.push({
        name: attribute.name,
        value: item.score?.toString() || "0",
      });
    }
  });

  return data;
};

export const generateComparisonChartData = (
  primaryData: Rating[],
  secondaryData: Rating[],
  chartConfig: ChartConfig,
  primaryLabel: string,
  secondaryLabel: string,
): ComparisonChartData => {
  const primaryChart = generateChartData(primaryData, chartConfig);
  const secondaryChart = generateChartData(secondaryData, chartConfig);

  const mergedData: ComparisonChartData = {};

  Object.keys(primaryChart).forEach((categoryKey) => {
    const mergedCategoryData = primaryChart[categoryKey].data.map((item) => {
      const match = secondaryChart[categoryKey].data.find((i) => i.name === item.name);
      return {
        name: item.name,
        [primaryLabel]: item.value,
        [secondaryLabel]: match?.value || "0",
      };
    });

    mergedData[categoryKey] = {
      title: primaryChart[categoryKey].title,
      description: primaryChart[categoryKey].description,
      data: mergedCategoryData,
      barColor: primaryChart[categoryKey].barColor,
    };
  });

  return mergedData;
};

export const getComparisonIndicator = (current: number, comparison: number) => {
  const diff = current - comparison;
  if (Math.abs(diff) < 0.2) return <Minus className="h-4 w-4 text-muted-foreground" />;
  return diff > 0 ? (
    <TrendingUp className="h-4 w-4 text-success" />
  ) : (
    <TrendingDown className="h-4 w-4 text-destructive" />
  );
};

export const getColorClasses = (color: string) => {
  const colorMap: Record<string, { text: string; badge: string }> = {
    purple: { text: "text-primary", badge: "bg-purple-500 text-white" },
    green: { text: "text-success", badge: "bg-green-500 text-white" },
    amber: { text: "text-amber-400", badge: "bg-amber-400 text-black" },
    blue: { text: "text-accent", badge: "bg-blue-500 text-white" },
  };

  return {
    text: colorMap[color]?.text || colorMap.purple.text,
    badge: colorMap[color]?.badge || colorMap.purple.badge,
  };
};

export const getComparisonColorClass = (current: number, comparison: number) => {
  const diff = current - comparison;
  if (Math.abs(diff) < 0.2) return "text-muted-foreground";
  return diff > 0 ? "text-success" : "text-destructive";
};

export const contentTypes = [
  { name: "News Article", icon: "📰", color: "bg-blue-600" },
  { name: "Controversy Analysis", icon: "⚡", color: "bg-destructive" },
  { name: "Topic Roundup", icon: "📊", color: "bg-success" },
  { name: "Industry Analysis", icon: "💼", color: "bg-primary" },
  { name: "Speculation Report", icon: "🔮", color: "bg-orange-600" },
  { name: "Community Analysis", icon: "👥", color: "bg-teal-600" },
];
