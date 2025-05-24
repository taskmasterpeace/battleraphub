"use client";
import { mockNewsItems, relatedAnalysisData } from "@/lib/static/static-data";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NewsItem } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import NotFound from "./NotFound";

import NewsAnalysisDetails from "./NewsAnalysisDetails";
const NewsDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const foundItem = mockNewsItems.find((item) => item.id === Number(id));
      setNewsItem(foundItem || mockNewsItems[0]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!newsItem) {
    return <NotFound />;
  }

  return (
    <>
      <main className="min-h-screen bg-background text-accent-foreground pb-16">
        {/* Hero Section */}
        <div className="relative w-full h-[40vh] min-h-[300px] bg-gradient-to-br from-amber-400/20 to-purple-600/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center text-accent-foreground bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-background transition-colors duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span>Back</span>
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">
                {newsItem.contentType === "News Article"
                  ? "📰"
                  : newsItem.contentType === "Controversy Analysis"
                    ? "⚡"
                    : newsItem.contentType === "Topic Roundup"
                      ? "📊"
                      : newsItem.contentType === "Industry Analysis"
                        ? "💼"
                        : newsItem.contentType === "Speculation Report"
                          ? "🔮"
                          : "👥"}
              </div>
              <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-medium">
                {newsItem.contentType}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <NewsAnalysisDetails newsItem={newsItem} />

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-background rounded-xl overflow-hidden border border-border shadow-lg p-6 mb-6 top-20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                  Core Topics
                </h3>
                <div className="space-y-2">
                  {newsItem.core_topics.map((topic: string) => (
                    <div
                      key={topic}
                      className="bg-background rounded-lg p-3 hover:bg-background transition-colors duration-200 cursor-pointer"
                    >
                      <span className="font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-background rounded-xl overflow-hidden border border-border shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                  Related Analysis
                </h3>
                <div className="space-y-4">
                  {relatedAnalysisData.map((item) => (
                    <Link href={`/news/${item.id}`} key={item.id} className="block group">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-purple-600/20 rounded-lg flex items-center justify-center text-xl">
                          {item.emoji}
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-amber-400 transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.daysAgo} day{item.daysAgo !== 1 ? "s" : ""} ago
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewsDetails;
