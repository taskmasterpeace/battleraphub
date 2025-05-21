"use client";

import Image from "next/image";
import { InfoIcon, MapPin } from "lucide-react";
import AttributesTab from "@/components/pages/battlers/details/AttributesTab";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useBattler } from "@/contexts/battler.context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { fadeIn, slideUp, staggerContainer } from "@/lib/static/framer-motion";

export default function BattlerPage() {
  const { battlerData, totalRatings, topBadgesAssignedByBattler } = useBattler();

  return (
    <div>
      {/* Banner */}
      <motion.div className="relative h-48" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-gray-950 z-10"></div>
        <Image
          src={battlerData?.banner || "/placeholder.svg?height=400&width=1920"}
          alt={battlerData?.name || "NA"}
          fill
          className="object-cover"
          priority
        />

        <div className="container relative z-20 h-full px-4 flex items-end pb-8">
          <motion.div
            className="flex items-end gap-6"
            initial="hidden"
            animate="visible"
            variants={slideUp}
          >
            <div className="relative sm:-mb-16">
              <div className="relative">
                <Image
                  src={battlerData?.avatar || "/placeholder.svg?height=140&width=140"}
                  alt={battlerData?.name || "NA"}
                  width={140}
                  height={140}
                  className="rounded-full border-2 border-primary bg-background h-[100px] w-[100px] min-w-[100px] sm:!h-[140px] sm:!w-[140px] object-cover"
                  priority
                />
              </div>
            </div>
            <div className="mb-2">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {battlerData?.name}
              </motion.h1>
              <motion.div
                className="text-muted-foreground flex items-center mt-1 gap-2 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {battlerData?.location}
                </span>
                {battlerData?.battler_tags?.map((tag) => (
                  <Badge
                    variant="default"
                    key={`tag-${tag.tags?.id}`}
                    className="text-xs px-2 py-0.5 rounded-full"
                  >
                    {tag.tags?.name}
                  </Badge>
                ))}
              </motion.div>
              <motion.div
                className="my-2 block sm:hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <div className="text-sm text-muted-foreground">Total Rating</div>
                <div className="text-4xl sm:text-5xl font-bold text-primary rating-glow">
                  {totalRatings.toFixed(1)}
                </div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="ml-auto text-center mb-2 hidden sm:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="text-sm text-muted-foreground">Total Rating</div>
            <div className="text-4xl sm:text-5xl font-bold text-primary rating-glow">
              {totalRatings.toFixed(1)}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <main className="container px-4 py-4 sm:py-8 sm:mt-16">
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={slideUp}>
          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-3">
            Top Assigned Badges
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-60">
                    These badges represent the most significant attributes assigned by the
                    community.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <motion.div
            className="flex flex-wrap gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {topBadgesAssignedByBattler
              .filter((badge) => badge.is_positive)
              .map((badge) => (
                <motion.div key={badge.badge_id} variants={slideUp}>
                  <Badge
                    className={cn(
                      "bg-green-900/30 text-success border border-success hover:bg-green-900/50 cursor-pointer transition-all duration-300 transform hover:scale-105",
                      "badge-hover",
                    )}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {badge.badge_name} ({badge.percentage})
                  </Badge>
                </motion.div>
              ))}
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-2 mt-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {topBadgesAssignedByBattler
              .filter((badge) => !badge.is_positive)
              .map((badge) => (
                <motion.div key={badge.badge_id} variants={slideUp}>
                  <Badge
                    className={cn(
                      "bg-red-900/30 text-destructive border border-destructive hover:bg-red-900/50 cursor-pointer transition-all duration-300 transform hover:scale-105",
                      "badge-hover",
                    )}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    {badge.badge_name} ({badge.percentage})
                  </Badge>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>

        <AttributesTab />
      </main>
    </div>
  );
}
