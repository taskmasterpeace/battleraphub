import { ROLE, ROLES_NAME } from "@/config";

import {
  ChartConfig,
  ChartData,
  ComparisonChartData,
  Rating,
  rolesWeights,
  NewsItem,
} from "@/types";
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

export const newsItems: NewsItem[] = [
  {
    id: "e1d79086-85dc-428a-b682-7956b148ec50",
    type: "topic_roundup",
    headline: 'URL’s "Voices of the Block" Series Amplifies Social Justice Through Battle Rap',
    published_at: "2023-11-02T15:30:00+00:00",
    event_date: "2023-10-28T00:00:00+00:00",
    location: "Atlanta, GA",
    league: "Ultimate Rap League (URL)",
    tags: ["Social Justice", "Emotional Storytelling", "Community Impact"],
    core_topics: ["Activism in Battle Rap", "Mental Health", "Cultural Identity"],
    main_event: {
      title: "Voices of the Block - Volume 1",
      description: "Main Event: Loaded Lux vs. B Dot",
    },
    format_innovation: {
      quote: "This isn’t just battle rap — it’s lyrical activism.",
      title: "Thematic Emphasis on Social Justice",
      description:
        "URL pioneers content-driven battles highlighting real-world issues like racial equity, mental health, and inner-city violence.",
    },
    community_reaction: {
      summary:
        "Fans and critics praised the blend of artistry and advocacy, noting the emotional impact and powerful messaging of the event.",
      overall_sentiment: "Inspiring",
      engagement_metrics: {
        likes: 120,
        retweets: 55,
      },
    },
    cultural_significance: {
      score: 10,
      narrative:
        "This event marked a cultural pivot in battle rap, using the platform for advocacy and real-world storytelling, drawing mainstream media attention.",
    },
    social_impact: {
      quote: "Lux and B Dot aren’t just spitting bars — they’re dropping knowledge.",
      highlight: "Youth engagement in inner cities through battle rap workshops",
      community_response: "Positive reception from educators, activists, and fans alike",
    },
    ai_predictions: [
      "Battle rap will increasingly intersect with activism and education.",
      "Expect more collaboration between leagues and nonprofit organizations addressing community issues.",
    ],
    notable_content: [
      "Lux’s closing round: “We turn pain into poetry, and struggle into soundtracks.”",
      "B Dot’s rebuttal: “I don’t need props to be powerful — just truth.”",
    ],
    executive_summary: {
      title: "Voices of the Block Recap",
      body: "URL’s socially driven battle series bridges battle culture with community empowerment, offering a powerful commentary on issues affecting urban youth. With thoughtful lyricism and civic themes, this event sets a new gold standard for conscious performance in the scene.",
    },
    related_analysis: [
      {
        icon: "✊",
        title: "Why Battle Rap Needs More Social Themes",
        published: "3 days ago",
      },
      {
        icon: "🧠",
        title: "Behind the Bars: The Psychology of Powerful Rounds",
        published: "5 days ago",
      },
    ],
    actions: {
      narrative:
        "Use your voice. Share this event to amplify conscious storytelling in hip-hop culture.",
      save_enabled: true,
      share_enabled: true,
    },
    contentType: "article",
    isBreaking: true,
  },
];

export const breakingNews = newsItems.filter((item) => item.isBreaking);

export const contentTypes = [
  { name: "News Article", icon: "📰", color: "bg-blue-600" },
  { name: "Controversy Analysis", icon: "⚡", color: "bg-destructive" },
  { name: "Topic Roundup", icon: "📊", color: "bg-success" },
  { name: "Industry Analysis", icon: "💼", color: "bg-primary" },
  { name: "Speculation Report", icon: "🔮", color: "bg-orange-600" },
  { name: "Community Analysis", icon: "👥", color: "bg-teal-600" },
];
