import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { slideUp, staggerContainer } from "@/lib/static/framer-motion";
import { Attribute } from "@/types";
import { getColorClasses, getComparisonIndicator } from "@/lib/static/static-data";

interface DetailedComparisonProps {
  currentBattler: string;
  comparisonBattler: string;
  currentData: Attribute[];
  comparisonData: Attribute[];
  color: string;
}

const DetailedComparison: React.FC<DetailedComparisonProps> = ({
  currentBattler,
  comparisonBattler,
  currentData,
  comparisonData,
  color: colorText,
}) => {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className={`text-lg font-medium mb-4 ${getColorClasses(colorText).text}`}>
            {currentBattler}
          </h3>
          <motion.div className="space-y-6" variants={staggerContainer}>
            {currentData?.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={slideUp}
                className="flex justify-between items-center"
              >
                <span>{skill.name}</span>
                <div className="flex items-center gap-2">
                  <Badge className={getColorClasses(colorText).badge}>
                    {skill.value?.toFixed(1) ?? "0.0"}
                  </Badge>
                  {getComparisonIndicator(skill.value ?? 0, comparisonData[index].value ?? 0)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h3 className={`text-lg font-medium mb-4 ${getColorClasses(colorText).text}`}>
            {comparisonBattler}
          </h3>
          <motion.div className="space-y-6" variants={staggerContainer}>
            {comparisonData?.map((skill) => (
              <motion.div
                key={skill.name}
                variants={slideUp}
                className="flex justify-between items-center"
              >
                <span>{skill.name}</span>
                <Badge className={getColorClasses(colorText).badge}>
                  {skill.value?.toFixed(1) ?? 0}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Visual Comparison */}
      <motion.div variants={slideUp} className="mt-8">
        <h3 className={`text-lg font-medium mb-4 text-center ${getColorClasses(colorText).text}`}>
          Head-to-Head Comparison
        </h3>
        <div className="space-y-4">
          {currentData?.map((skill, index) => {
            const currentValue = skill.value ?? 0;
            const comparisonValue = comparisonData[index]?.value ?? 0;
            const totalWidth = currentValue + comparisonValue;
            const currentPercentage = (currentValue / totalWidth) * 100;

            return (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentBattler}</span>
                  <span>{skill.name}</span>
                  <span className="text-muted-foreground">{comparisonBattler}</span>
                </div>
                <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    className={getColorClasses(colorText).badge + "text-center rounded-full"}
                    style={{ width: `${currentPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                  <motion.div
                    style={{ width: `${100 - currentPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - currentPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>{currentValue.toFixed(1)}</span>
                  <span>{comparisonValue.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailedComparison;
