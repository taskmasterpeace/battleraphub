import { ROLE, ROLES_NAME } from "@/config";

import {
  ChartConfig,
  ChartData,
  ComparisonChartData,
  Rating,
  rolesWeights,
  NewsItem,
  RelatedAnalysisItem,
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
    id: 1,
    headline: "The Greatness Debate: Who Reigns Supreme in Modern Rap?",
    core_topics: ["Greatness in Rap", "Drake's Legacy and Impact", "Comparison of Artists"],
    summary:
      "The discussion surrounding what defines 'greatness' in rap has intensified, particularly through the lens of prominent artists like Drake and Kendrick Lamar. Their respective legacies and influences spark ongoing debates among fans and critics alike on social media, as comparisons often lead to passionate arguments about their contributions to hip-hop culture.",
    key_figures: [
      { name: "Drake", role: "Icon and Dominant Force in Rap" },
      { name: "Kendrick Lamar", role: "Lyrical Innovator and Cultural Commentator" },
      { name: "Lil Wayne", role: "Influential Mentor and Rap Veteran" },
      { name: "Joey Bada$", role: "Emerging Artist Seeking Recognition" },
    ],
    community_reaction: {
      sentiment: "mixed",
      engagement_metrics: { volume: 50, intensity: 65 },
    },
    notable_content: [
      "Defining 'greatness' in rap is tough—awards, sales, and impact all weigh differently...",
      "Kendrick and Drake were the 'big three'; Joey never gets mentioned in that...",
    ],
    predictions: [
      "As new artists emerge and social media continues to amplify these debates, expect rising challengers like Joey Bada$ to reshape narratives around greatness in rap.",
      "The influence of historical heavyweights like Nas and Jay-Z will persist, fostering discussions about the evolution of artistic standards.",
    ],
    connection_strength: 9,
    cultural_significance: 8,
    contentType: "Cultural Analysis",
    time: "2 hours ago",
    category: "analysis",
    isBreaking: true,
  },
  {
    id: 2,
    headline: "Mentorship: A Crucial Thread in Battle Rap Culture",
    core_topics: ["Impact of Mentorship in Rap Culture", "URL vs SMACK"],
    summary:
      "Mentorship in the battle rap scene is pivotal, particularly for newcomers transitioning from URL to the more prestigious SMACK events. Discussions highlight how established rappers mentor emerging talents, shaping the future landscape of battle rap and ensuring the continuity of skills and styles vital to competitive success.",
    key_figures: [
      { name: "Established Battle Rappers", role: "Mentors in the Scene" },
      { name: "Rising URL Stars", role: "Emerging Talents Seeking Guidance" },
    ],
    community_reaction: {
      sentiment: "positive",
      engagement_metrics: { volume: 40, intensity: 55 },
    },
    notable_content: [
      "Discussions in recent forums highlight how established battle rappers often take emerging talents under their wing.",
      "A notable example includes how certain SMACK-affiliated veterans have been mentoring URL's rising stars.",
    ],
    predictions: [
      "As mentorship practices expand, expect a new generation of battle rappers to emerge with refined skills and unique styles, potentially influencing the competitive dynamics between URL and SMACK.",
      "Increased collaboration between veteran artists and newcomers will likely shift audience preferences and expectations in future battles.",
    ],
    connection_strength: 8,
    cultural_significance: 7,
    contentType: "Community Analysis",
    time: "6 hours ago",
    category: "analysis",
    isBreaking: false,
  },
  {
    id: 3,
    headline: "Platform Wars: The Battle for Hip-Hop Streaming Dominance",
    core_topics: ["Streaming Platforms", "Artist Revenue", "Industry Competition"],
    summary:
      "The competition between streaming platforms has intensified as they vie for exclusive content and artist partnerships. Recent developments show platforms offering unprecedented deals to secure top-tier talent, fundamentally changing how artists approach content distribution and fan engagement.",
    key_figures: [
      { name: "Spotify", role: "Market Leader in Music Streaming" },
      { name: "Apple Music", role: "Premium Platform Competitor" },
      { name: "Independent Artists", role: "Beneficiaries of Platform Competition" },
    ],
    community_reaction: {
      sentiment: "positive",
      engagement_metrics: { volume: 35, intensity: 45 },
    },
    notable_content: [
      "Artists are now leveraging platform competition to secure better deals and maintain creative control.",
      "The shift towards exclusive content is reshaping how fans consume music and discover new artists.",
    ],
    predictions: [
      "Expect more platforms to enter the exclusive content space, driving up artist compensation.",
      "Traditional record labels will need to adapt their strategies to compete with platform-direct deals.",
    ],
    connection_strength: 7,
    cultural_significance: 6,
    contentType: "Industry Analysis",
    time: "1 day ago",
    category: "industry",
    isBreaking: false,
  },
  {
    id: 4,
    headline: "The Evolution of Lyricism: From Wordplay to Social Commentary",
    core_topics: ["Lyrical Evolution", "Social Commentary in Rap", "Artistic Innovation"],
    summary:
      "Modern rap has witnessed a significant shift from traditional wordplay-focused lyricism to more socially conscious and politically aware content. This evolution reflects broader cultural changes and demonstrates how artists use their platforms to address contemporary issues while maintaining artistic integrity.",
    key_figures: [
      { name: "J. Cole", role: "Socially Conscious Lyricist" },
      { name: "Kendrick Lamar", role: "Political Commentary Pioneer" },
      { name: "Nas", role: "Lyrical Foundation and Influence" },
    ],
    community_reaction: {
      sentiment: "positive",
      engagement_metrics: { volume: 45, intensity: 60 },
    },
    notable_content: [
      "The new generation of rappers seamlessly blends entertainment with education, creating impactful messages.",
      "Social media has amplified the reach of conscious rap, making political commentary more accessible to younger audiences.",
    ],
    predictions: [
      "Expect continued growth in socially conscious rap as artists respond to current events and social movements.",
      "Traditional battle rap may incorporate more social commentary elements to stay relevant with evolving audience expectations.",
    ],
    connection_strength: 8,
    cultural_significance: 9,
    contentType: "Cultural Analysis",
    time: "2 days ago",
    category: "analysis",
    isBreaking: false,
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

// Categories for filtering
export const categories = [
  { id: "all", name: "All Content" },
  { id: "events", name: "Events" },
  { id: "analysis", name: "Analysis" },
  { id: "announcements", name: "Announcements" },
  { id: "industry", name: "Industry" },
];

export const mockNewsItems: NewsItem[] = [
  {
    id: 1,
    headline: "The Greatness Debate: Who Reigns Supreme in Modern Rap?",
    core_topics: ["Greatness in Rap", "Drake's Legacy and Impact", "Comparison of Artists"],
    summary:
      "The discussion surrounding what defines 'greatness' in rap has intensified, particularly through the lens of prominent artists like Drake and Kendrick Lamar. Their respective legacies and influences spark ongoing debates among fans and critics alike on social media, as comparisons often lead to passionate arguments about their contributions to hip-hop culture.",
    key_figures: [
      { name: "Drake", role: "Icon and Dominant Force in Rap" },
      { name: "Kendrick Lamar", role: "Lyrical Innovator and Cultural Commentator" },
      { name: "Lil Wayne", role: "Influential Mentor and Rap Veteran" },
      { name: "Joey Bada$", role: "Emerging Artist Seeking Recognition" },
    ],
    community_reaction: {
      sentiment: "mixed",
      engagement_metrics: { volume: 50, intensity: 65 },
    },
    notable_content: [
      "Defining 'greatness' in rap is tough—awards, sales, and impact all weigh differently...",
      "Kendrick and Drake were the 'big three'; Joey never gets mentioned in that...",
    ],
    predictions: [
      "As new artists emerge and social media continues to amplify these debates, expect rising challengers like Joey Bada$ to reshape narratives around greatness in rap.",
      "The influence of historical heavyweights like Nas and Jay-Z will persist, fostering discussions about the evolution of artistic standards.",
    ],
    connection_strength: 9,
    cultural_significance: 8,
    contentType: "Cultural Analysis",
    publishDate: "June 15, 2023",
    time: "2 hours ago",
    category: "analysis",
    fullAnalysis: "<h3>Executive Summary</h3><p>Our comprehensive analysis...</p>",
    relatedTopics: ["Hip-Hop Legacy", "Artist Comparisons", "Cultural Impact"],
  },
];

export const narrativeClusterData = [
  {
    narrative_clusters: [
      {
        headline: "The Clash of Titans: Drake vs Kendrick Lamar in the Battle for Greatness",
        core_topics: [
          "discussions on greatness in rap between Drake and Kendrick Lamar",
          "commercial success vs artistry in rap",
          "impact of accolades in hip-hop",
        ],
        summary:
          "The ongoing debate over who reigns supreme in the rap world—Drake or Kendrick Lamar—centers around their contrasting contributions to the genre. While Drake's commercial success is undeniable, Kendrick's artistry and profound cultural impact carve out a unique legacy that questions the true nature of 'greatness' in hip-hop. These themes intertwine as fans and critics analyze the significance of accolades and awards in defining rap excellence.",
        key_figures: [
          { name: "Drake", role: "Commercial Success Icon" },
          { name: "Kendrick Lamar", role: "Artistic Visionary" },
          { name: "Eminem", role: "Benchmark of Success and Skill" },
          { name: "Jay-Z", role: "Influential Authority on Legacy" },
        ],
        community_reaction: {
          sentiment: "mixed",
          engagement_metrics: { volume: 50, intensity: 70 },
        },
        notable_content: [
          "Multiple tweets questioning if accolades matter when evaluating artistry.",
          "YouTube video 'Kendrick vs Drake battle?' exploring their rivalry.",
          "Comparative lyric analyses showcasing strengths and weaknesses in both artists' discographies.",
        ],
        predictions: [
          "Expect increased public discourse as new albums drop from both artists.",
          "More debates dissecting the relevance of awards in hip-hop will emerge.",
          "Collaborations or beefs could reignite tensions and elevate the conversation.",
        ],
        connection_strength: 8,
        cultural_significance: 9,
      },
      {
        headline: "Artistry or Sales: The Great Hip-Hop Debate",
        core_topics: [
          "Drake's commercial success vs Kendrick's artistry",
          "impact of accolades in hip-hop",
        ],
        summary:
          "This narrative delves into the tension between commercial success and artistic integrity in rap, as Drake's chart-topping hits contrast sharply with Kendrick's critically acclaimed storytelling. Fans grapple with whether record sales and awards should overshadow the deeper messages and cultural commentary that Kendrick brings to the table.",
        key_figures: [
          { name: "Drake", role: "Chart-Topping Hitmaker" },
          { name: "Kendrick Lamar", role: "Lyrical Innovator" },
          { name: "Billboard Charts", role: "Industry Authority on Success" },
        ],
        community_reaction: {
          sentiment: "negative",
          engagement_metrics: { volume: 30, intensity: 60 },
        },
        notable_content: [
          "A viral Twitter thread dissecting the perceived disparity between the two artists.",
          "YouTube video 'Battle Rapper Breaks Down Kendrick Lamar VS Drake' focusing on lyrical analysis.",
          "Memes highlighting the debate over their credibility in the eyes of fans.",
        ],
        predictions: [
          "As streaming influences growth, the discussion may shift towards the role of platforms in shaping perception.",
          "Future battles in the lyrical arena may influence how fans view both artists' legacies.",
          "Critical reviews of respective upcoming projects could escalate or settle the ongoing debate.",
        ],
        connection_strength: 9,
        cultural_significance: 8,
      },
      {
        headline: "Accolades and Impact: Decoding Hip-Hop's Greatness",
        core_topics: ["impact of accolades in hip-hop", "greatness and impact in rap"],
        summary:
          "An exploration of how accolades function as a benchmark for evaluating excellence in hip-hop as discussions reveal that the significance of awards is frequently contested. This highlights the ongoing complexities of measuring success in a genre where artistic impact can sometimes rival—or even outshine—commercial achievements.",
        key_figures: [
          { name: "Jay-Z", role: "Award Record Holder" },
          { name: "Eminem", role: "Cultural Marker" },
          { name: "Drake", role: "Accolade Accumulator" },
          { name: "Kendrick Lamar", role: "Cultural Commentator" },
        ],
        community_reaction: {
          sentiment: "neutral",
          engagement_metrics: { volume: 25, intensity: 50 },
        },
        notable_content: [
          "A podcast episode analyzing the impact of major awards on artist standing.",
          "Discussion threads highlighting differences in fan bases regarding accolades' significance.",
          "Reports on the evolving nature of recognition in hip-hop.",
        ],
        predictions: [
          "Increased scrutiny over award shows, possibly leading to different award categories focused on artistry.",
          "Future artists will likely grapple with balancing commercial success against artistic integrity as they rise in the industry.",
          "Anticipated changes in industry awards criteria due to mixed community sentiments.",
        ],
        connection_strength: 7,
        cultural_significance: 7,
      },
    ],
    content_highlights: {
      tweets: [
        "Defining 'greatness' in rap is tough—awards, sales, and impact all weigh differently.",
        "If accolades don’t matter because they’re not yours, then why bring up Kendrick at all?",
      ],
      videos: [
        "Drake vs Kendrick Lamar (How will this end) - Humble King Reloaded",
        "Kendrick vs Drake battle? - cousinfikTV",
        "Battle Rapper Breaks Down Kendrick Lamar VS Drake… (Part 1) - Jalopy Bungus",
      ],
      discussions: [
        "The generational divide in fan perceptions with older fans favoring Kendrick and younger fans favoring Drake.",
        "Impact of recent Kendrick singles and how they shift the narrative between the two artists.",
      ],
    },
  },
];

export const relatedAnalysisData: RelatedAnalysisItem[] = [
  {
    id: 1,
    emoji: "📊",
    title: "Tay Roc vs Rum Nitty Hype Analysis",
    daysAgo: 1,
  },
  {
    id: 2,
    emoji: "⚡",
    title: "KOTD Toronto Impact Assessment",
    daysAgo: 2,
  },
  {
    id: 3,
    emoji: "🔮",
    title: "Platform Wars: Streaming Battle",
    daysAgo: 3,
  },
];
