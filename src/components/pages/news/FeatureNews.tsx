import { contentTypes } from "@/lib/static/static-data";
import { BarChart3, ChevronRight, Zap } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useNews } from "@/contexts/news.context";
import { formatDate } from "@/lib/utils";

const FeatureNews = () => {
  const { newsItems: filteredNews } = useNews();
  return (
    <section className="w-full py-12">
      <div className="container px-4 mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-8 inline-block relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Featured Analysis
          <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400"></span>
        </motion.h2>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Featured Item */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="col-span-1 lg:col-span-1"
            >
              <Link href={`/news/${filteredNews[0].id}`} className="block h-full">
                <div className="bg-background rounded-xl overflow-hidden border border-border h-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-amber-400/20 to-purple-600/20 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-6xl mb-4">
                        {contentTypes.find((type) => type.name === filteredNews[0].contentType)
                          ?.icon || "📰"}
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-2">
                        {filteredNews[0].contentType}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-muted via-muted to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-amber-400 text-accent-foreground px-2 py-1 rounded text-sm font-medium">
                          {filteredNews[0].league}
                        </div>
                        {filteredNews[0].isBreaking && (
                          <div className="bg-destructive text-accent-foreground px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                            <Zap size={12} />
                            Breaking
                          </div>
                        )}
                        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-sm">
                          Cultural Impact: {filteredNews[0].cultural_significance.score}/10
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-sm">
                          📍 {filteredNews[0].location}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-amber-400 transition-colors duration-200">
                        {filteredNews[0].headline}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {filteredNews[0].main_event.title}
                      </p>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <span>
                            👍 {filteredNews[0].community_reaction.engagement_metrics.likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            🔄 {filteredNews[0].community_reaction.engagement_metrics.retweets}
                          </span>
                        </div>
                        <span className="ml-auto">
                          {formatDate(filteredNews[0].published_at || "")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {filteredNews[0].tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {filteredNews[0].tags.length > 3 && (
                        <span className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground">
                          +{filteredNews[0].tags.length - 3} more
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {filteredNews[0].executive_summary.body}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Sentiment: {filteredNews[0].community_reaction.overall_sentiment}
                      </div>
                      <span className="text-amber-400 hover:underline flex items-center group text-sm font-medium">
                        Read Analysis
                        <ChevronRight
                          size={16}
                          className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Secondary Featured Items */}
            <div className="col-span-1 lg:col-span-1 grid grid-cols-1 gap-6">
              {filteredNews.slice(1, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/news/${item.id}`} className="block h-full">
                    <div className="bg-background rounded-xl overflow-hidden border border-border h-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="flex h-full">
                        <div className="relative w-1/3 bg-gradient-to-br from-amber-400/20 to-purple-600/20 flex items-center justify-center">
                          <div className="text-3xl">
                            {contentTypes.find((type) => type.name === item.contentType)?.icon ||
                              "📰"}
                          </div>
                        </div>
                        <div className="p-5 flex flex-col w-2/3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-amber-400 text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                              {item.league}
                            </div>
                            <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                              {item.type.replace("_", " ")}
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
                            {item.headline}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow">
                            {item.executive_summary.body}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <div className="flex items-center gap-1">
                                <span>👍 {item.community_reaction.engagement_metrics.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BarChart3 size={12} />
                                <span>{item.cultural_significance.score}/10</span>
                              </div>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {formatDate(item.published_at || "")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            className="bg-background rounded-xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-muted-foreground">
              No analysis found matching your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeatureNews;
