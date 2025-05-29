import { Search } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { useNews } from "@/contexts/news.context";
import { Input } from "@/components/ui/input";

const NewsHeroSection = () => {
  const { searchQuery, setSearchQuery } = useNews();

  return (
    <>
      {/* Hero Section */}
      <section className="w-full pt-16 flex items-center justify-center overflow-hidden">
        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-accent-muted mb-4">
              BATTLE RAP <span className="text-amber-400">STORIES</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground max-w-2xl mx-auto mb-8">
              Dive deep into the mysteries, legends, and untold stories of battle rap culture
            </p>
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                type="search"
                placeholder="Search topics, battlers, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-accent backdrop-blur-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:!ring-amber-400 transition-all duration-300 h-[50px]"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NewsHeroSection;
