"use client";
import { contentTypes } from "@/lib/static/static-data";
import { ArrowUp, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewsHeroSection from "./NewsHeroSection";
import FeatureNews from "./FeatureNews";
import { LatestAnalysis } from "./LatestAnalytics";
import { NarrativeClusterCard } from "./NarrativeClusterCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNews } from "@/contexts/news.context";

const News = () => {
  const { newsItems: filteredNews } = useNews();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <main className="min-h-screen bg-background text-accent-muted">
      {/* Hero Section */}
      <NewsHeroSection />

      {/* Featured Analysis */}
      <FeatureNews />

      {/* Latest Analysis Feed */}
      <LatestAnalysis contentTypes={contentTypes} />

      {/* Active Narrative Clusters */}
      <section className="w-full py-12 bg-background">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-8 inline-block relative">
            Active Narrative Clusters
            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-400"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((cluster, index) => (
              <NarrativeClusterCard
                key={cluster.headline}
                cluster={cluster.cultural_significance}
                index={index}
              />
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
