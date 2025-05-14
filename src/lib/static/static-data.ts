import { ROLE, ROLES_NAME } from "@/config";
import { ChartConfig, ChartData, ComparisonChartData, Rating, rolesWeights } from "@/types";

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
    role_id: ROLE.BATTLE,
    formKey: "battler",
    key: ROLES_NAME[ROLE.BATTLE],
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
