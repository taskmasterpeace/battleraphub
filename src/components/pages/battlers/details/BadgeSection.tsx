"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BadgeItem {
  badge: string;
  description: string;
}

interface BadgeSectionProps {
  title: string;
  badges: BadgeItem[];
  isPositive: boolean;
  selectedBadges: string[];
  onSelectBadge: (badge: string, isPositive: boolean) => void;
}

export default function BadgeSection({
  title,
  badges,
  isPositive,
  selectedBadges,
  onSelectBadge,
}: BadgeSectionProps) {
  // Track which badge is being hovered
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Get color scheme based on positive/negative
  const getColorScheme = (isSelected: boolean) => {
    if (isPositive) {
      return isSelected
        ? "bg-success/10 dark:bg-success/20 text-success border-success/70 hover:bg-success-foreground shadow-md shadow-success-900/30"
        : "bg-background text-muted-foreground dark:text-white/80 border-border hover:bg-success/10 hover:border-success/70";
    } else {
      return isSelected
        ? "bg-destructive/10 dark:bg-destructive/20 text-destructive border-destructive/70 hover:bg-destructive-foreground shadow-md shadow-destructive-900/30"
        : "bg-background text-muted-foreground dark:text-white/80 border-border hover:bg-destructive/15 hover:border-destructive/70";
    }
  };

  return (
    <div>
      <h3
        className={`text-lg font-semibold mb-4 flex items-center ${isPositive ? "text-success" : "text-destructive"}`}
      >
        {isPositive ? (
          <CheckCircle className="w-5 h-5 mr-2" />
        ) : (
          <XCircle className="w-5 h-5 mr-2" />
        )}
        {title}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {badges.map((badgeItem, index) => {
          const isSelected = selectedBadges.includes(badgeItem.badge);
          const isHovered = hoveredBadge === badgeItem.badge;

          return (
            <TooltipProvider key={`${badgeItem.badge}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 h-full
                      transform hover:scale-105 active:scale-95
                      ${getColorScheme(isSelected)}
                    `}
                    onClick={() => onSelectBadge(badgeItem.badge, isPositive)}
                    onMouseEnter={() => setHoveredBadge(badgeItem.badge)}
                    onMouseLeave={() => setHoveredBadge(null)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm sm:text-base font-medium mb-2">
                        {badgeItem.badge}
                      </span>

                      {/* Show a preview of description on hover */}
                      <div>
                        <p
                          className={`text-xs text-muted-foreground line-clamp-2 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
                        >
                          {badgeItem.description}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div
                          className={`absolute -top-2 -right-2 rounded-full p-1 
                            ${isPositive ? "bg-success" : "bg-destructive"}`}
                        >
                          {isPositive ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{badgeItem.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
