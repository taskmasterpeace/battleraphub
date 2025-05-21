"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fadeIn, staggerContainer } from "@/lib/static/framer-motion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  const [showAllBadges, setShowAllBadges] = useState(false);
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

  const visibleBadges = showAllBadges ? badges : badges.slice(0, 6);

  return (
    <motion.div className="mt-10" variants={fadeIn}>
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

      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-3" variants={staggerContainer}>
        {visibleBadges.map((badgeItem, index) => {
          const isSelected = selectedBadges.includes(badgeItem.badge);
          return (
            <TooltipProvider key={`${badgeItem.badge}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`
                      relative cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 h-full
                      transform hover:scale-105 active:scale-95
                      ${getColorScheme(isSelected)}
                    `}
                    onClick={() => onSelectBadge(badgeItem.badge, isPositive)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm sm:text-base text-center">{badgeItem.badge}</span>
                      {isSelected && (
                        <motion.div
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${isPositive ? "bg-success" : "bg-destructive"}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          {isPositive ? (
                            <CheckCircle className="w-3 h-3 text-white" />
                          ) : (
                            <XCircle className="w-3 h-3 text-white" />
                          )}
                        </motion.div>
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
      </motion.div>

      {badges.length > 6 && (
        <div className="mt-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllBadges(!showAllBadges)}
            className="text-primary hover:text-primary-foreground"
          >
            {showAllBadges ? "Show Less" : "Show All"}{" "}
            {showAllBadges ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
