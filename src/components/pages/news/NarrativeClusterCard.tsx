import { Cluster } from "@/types";
import { motion } from "framer-motion";
import React from "react";

interface ClusterCardProps {
  cluster: Cluster;
  index: number;
}

export const NarrativeClusterCard: React.FC<ClusterCardProps> = ({ cluster, index }) => {
  return (
    <motion.div
      key={cluster.headline}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.02 }}
      className="bg-background rounded-lg p-4 border border-border hover:border-amber-400/50 transition-all duration-300"
    >
      <h3 className="font-bold mb-2 text-sm">{cluster.headline}</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-muted-foreground">Connection Strength</span>
        <span className="text-amber-400 font-medium">{cluster.connection_strength}/10</span>
      </div>
      <div className="w-full bg-background rounded-full h-2 mb-2">
        <div
          className="bg-amber-400 h-2 rounded-full"
          style={{ width: `${(cluster.connection_strength / 10) * 100}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {cluster.core_topics.length} active topics
      </div>
    </motion.div>
  );
};
