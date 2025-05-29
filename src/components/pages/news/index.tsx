"use client";
import { ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NewsHeroSection from "./NewsHeroSection";
import FeatureNews from "./FeatureNews";

const News = () => {
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
