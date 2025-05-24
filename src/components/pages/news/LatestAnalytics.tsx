import { NewsItem } from "@/types";
import { motion } from "framer-motion";
import { NewsCard } from "./NewsCard";

interface LatestAnalysisProps {
  filteredNews: NewsItem[];
  searchQuery: string;
  contentTypes: { name: string; icon: string }[];
  categories: { id: string; name: string }[];
}

export function LatestAnalysis({
  filteredNews,
  searchQuery,
  contentTypes,
  categories,
}: LatestAnalysisProps) {
  return (
    <section className="w-full py-12 bg-background">
      <div className="container px-4 mx-auto">
        {filteredNews.length > 2 ? (
          <>
            <motion.h2
              className="text-3xl font-bold mb-8 inline-block relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Latest Analysis
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400"></span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.slice(2).map((item) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  contentTypes={contentTypes}
                  categories={categories}
                />
              ))}
            </div>
          </>
        ) : filteredNews.length <= 2 && searchQuery ? (
          <motion.div
            className="bg-background rounded-xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-muted-foreground">
              No additional analysis found matching your search criteria.
            </p>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
