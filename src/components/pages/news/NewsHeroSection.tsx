import { Search, Zap } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { breakingNews } from "@/lib/static/static-data";

const NewsHeroSection = ({
  searchQuery,
  setSearchQuery,
}: {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}) => {
  return (
    <>
      {breakingNews.length > 0 && (
        <div className="bg-amber-400 text-muted py-2">
          <div className="container px-4 mx-auto">
            <div className="flex items-center">
              <span className="font-bold mr-3 flex items-center gap-1">
                <Zap size={16} />
                BREAKING:
              </span>
              <div className="overflow-hidden">
                <div className="whitespace-nowrap overflow-x-auto scrollbar-hide">
                  {breakingNews.map((item, index) => (
                    <span key={item.id} className="mr-8">
                      {item.headline.length > 80
                        ? item.headline.substring(0, 80) + "..."
                        : item.headline}
                      {index < breakingNews.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=800&width=1600&text=AI+Battle+Rap+News"
            alt="AI Battle Rap News"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-muted via-transparent to-muted"></div>
        </div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 bg-amber-400/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-amber-400 font-medium flex items-center gap-2">
                <Zap size={16} />
                AI-Powered Battle Rap Intelligence
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-accent-muted mb-4">
              BATTLE RAP <span className="text-amber-400">INSIGHTS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Comprehensive analysis of battle rap culture through AI synthesis of social media and
              video content
            </p>
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="search"
                placeholder="Search topics, battlers, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-accent backdrop-blur-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted to-transparent"></div>
      </section>
    </>
  );
};

export default NewsHeroSection;
