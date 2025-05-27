"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { NewsItem, RelatedAnalysisItem } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import NotFound from "./NotFound";

import NewsAnalysisDetails from "./NewsAnalysisDetails";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import useSWR from "swr";
const NewsDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchNewsItem = async (id: string): Promise<NewsItem | null> => {
    const { data, error } = await supabase
      .from(DB_TABLES.NEWS_CONTENTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    return data;
  };

  const { data: newsItem, isLoading } = useSWR(id ? [`newsItem`, id] : null, () =>
    fetchNewsItem(id as string),
  );

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
          <div className="absolute inset-0 bg-gradient-to-t from-muted via-muted/60 to-transparent"></div>
          <div className="absolute top-6 left-6 z-10">
            <Button
              onClick={() => router.push("/news")}
              className="flex items-center text-muted-foreground bg-background/60 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-background/80 transition-colors duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span>Back</span>
            </Button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">
                {newsItem.type === "news_article"
                  ? "📰"
                  : newsItem.type === "controversy_analysis"
                    ? "⚡"
                    : newsItem.type === "topic_roundup"
                      ? "📊"
                      : newsItem.type === "industry_analysis"
                        ? "💼"
                        : newsItem.type === "speculation_report"
                          ? "🔮"
                          : "👥"}
              </div>
              <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-medium">
                {newsItem.actions.narrative}
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
                      className="bg-accent rounded-lg p-3 hover:bg-accent/80 transition-colors duration-200 cursor-pointer"
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
                  {newsItem.related_analysis.map((item: RelatedAnalysisItem, index: number) => (
                    <Link href={`/news/${index + 2}`} key={index} className="block group">
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-purple-600/20 rounded-lg flex items-center justify-center text-xl">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium group-hover:text-amber-400 transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{item.published}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-background rounded-xl overflow-hidden border border-border shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                  Get AI Insights
                </h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to receive weekly AI-powered battle rap analysis and predictions.
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                  />
                  <Button className="w-full bg-amber-400 hover:bg-amber-400 text-accent-foreground font-medium px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <Zap size={16} />
                    Subscribe
                  </Button>
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
