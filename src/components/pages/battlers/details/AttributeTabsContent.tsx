import { Attribute, Badge } from "@/types";
import AttributeSlider from "@/components/pages/battlers/details/AttributeSlider";
import BadgeSection from "@/components/pages/battlers/details/BadgeSection";

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
}: TabContentProps) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-muted-foreground mb-6">{description}</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {attributes.map((attr) => (
        <AttributeSlider
          key={attr.name}
          title={attr.name}
          description={attr.description || ""}
          value={ratings?.[attr.id]?.score ?? 0}
          onChange={(value) => handleRatingChange(attr.id, value)}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
        />
      ))}
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
