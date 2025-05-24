"use client";
import {
  categories,
  contentTypes,
  narrativeClusterData,
  newsItems,
} from "@/lib/static/static-data";
import { ArrowUp, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewsHeroSection from "./NewsHeroSection";
import FeatureNews from "./FeatureNews";
import { NewsItem } from "@/types";
import { LatestAnalysis } from "./LatestAnalytics";
import { NarrativeClusterCard } from "./NarrativeClusterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredNews: NewsItem[] = newsItems.filter((item) => {
    const matchesSearch =
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key_figures.some((figure) =>
        figure.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      item.core_topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const clusters = narrativeClusterData.flatMap((d) => d.narrative_clusters);

  return (
    <main className="min-h-screen bg-background text-accent-muted">
      {/* Hero Section */}
      <NewsHeroSection setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

      {/* Category Navigation */}
      <section className="sticky top-[60px] z-30 bg-background backdrop-blur-md border-b border-border py-4 shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-amber-400 hover:bg-amber-500 text-muted"
                    : "bg-background text-muted-foreground hover:bg-background/70"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Analysis */}
      <FeatureNews filteredNews={filteredNews} />

      {/* Latest Analysis Feed */}
      <LatestAnalysis
        filteredNews={filteredNews}
        searchQuery={searchQuery}
        contentTypes={contentTypes}
        categories={categories}
      />

      {/* Active Narrative Clusters */}
      <section className="w-full py-12 bg-background">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-8 inline-block relative">
            Active Narrative Clusters
            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster, index) => (
              <NarrativeClusterCard key={cluster.headline} cluster={cluster} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Culture</h2>
            <p className="text-muted-foreground mb-8">
              Get AI-powered battle rap insights and analysis delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
              />
              <Button className="bg-amber-400 hover:bg-amber-500 text-muted font-medium px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex items-center gap-2">
                <Zap size={16} />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          className="fixed bottom-8 right-8 bg-amber-400 text-muted p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </main>
  );
};

export default News;
