import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BarChart3, Bookmark, Brain, Calendar, Share2, Target } from "lucide-react";
import { KeyFigure, NewsItem } from "@/types";

const NewsAnalysisDetails = ({ newsItem }: { newsItem: NewsItem }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-background rounded-xl overflow-hidden border border-border shadow-lg">
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 mb-6 text-accent-foreground">
            <Badge className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm">
              <Brain size={16} />
              <span>AI Analysis</span>
            </Badge>
            <Badge className="bg-amber-400 text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium">
              {newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
            </Badge>
            <Badge className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm">
              <Calendar size={16} />
              <span>{newsItem.publishDate}</span>
            </Badge>
            <Badge className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full text-sm">
              <Target size={16} />
              <span>Cultural Impact: {newsItem.cultural_significance}/10</span>
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{newsItem.headline}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {newsItem.key_figures.map((figure: KeyFigure) => (
              <div
                key={figure.name}
                className="bg-background px-3 py-2 rounded-lg hover:bg-background transition-colors duration-200 cursor-pointer group"
                title={figure.role}
              >
                <div className="text-sm font-medium text-accent-foreground">{figure.name}</div>
                <div className="text-xs text-muted-foreground group-hover:text-muted-foreground">
                  {figure.role}
                </div>
              </div>
            ))}
          </div>

          {/* Analysis Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-6 border-b border-border">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 size={20} className="text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-accent-foreground">
                  {newsItem.connection_strength}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Connection Strength</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target size={20} className="text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-accent-foreground">
                  {newsItem.cultural_significance}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Cultural Significance</p>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Executive Summary
            </h2>
            <div className="bg-background rounded-xl p-6 border-l-4 border-amber-400">
              <p className="text-muted-foreground">{newsItem.summary}</p>
            </div>
          </div>

          {/* Community Reaction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Community Reaction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background rounded-xl p-6">
                <h3 className="font-bold mb-3">Overall Sentiment</h3>
                <div
                  className={`text-3xl font-bold mb-2 ${
                    newsItem.community_reaction.sentiment === "positive"
                      ? "text-green-400"
                      : newsItem.community_reaction.sentiment === "negative"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {newsItem.community_reaction.sentiment.charAt(0).toUpperCase() +
                    newsItem.community_reaction.sentiment.slice(1)}
                </div>
                <p className="text-muted-foreground text-sm">Community response to this topic</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h3 className="font-bold mb-3">Engagement Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="text-amber-400 font-bold">
                      {newsItem.community_reaction.engagement_metrics.volume}/100
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{
                        width: `${newsItem.community_reaction.engagement_metrics.volume}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Intensity</span>
                    <span className="text-amber-400 font-bold">
                      {newsItem.community_reaction.engagement_metrics.intensity}/100
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{
                        width: `${newsItem.community_reaction.engagement_metrics.intensity}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notable Content */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Notable Content
            </h2>
            <div className="space-y-4">
              {newsItem.notable_content.map((content: string, index: number) => (
                <div
                  key={index}
                  className="bg-background rounded-xl p-6 border-l-4 border-amber-400"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-muted font-bold text-sm">
                      "
                    </div>
                    <p className="text-muted-foreground italic flex-1">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Analysis */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Detailed Analysis
            </h2>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: newsItem.fullAnalysis ?? "" }} />
            </div>
          </div>

          {/* Predictions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              AI Predictions
            </h2>
            <div className="space-y-3">
              {newsItem.predictions.map((prediction: string, index: number) => (
                <div key={index} className="flex items-start gap-3 bg-background rounded-lg p-4">
                  <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-muted text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground">{prediction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between mt-10 pt-6 border-t border-border gap-4">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-background hover:bg-background px-4 py-2 rounded-md transition-colors duration-200">
                <Share2 size={18} />
                <span>Share Analysis</span>
              </button>
              <button
                className={`flex items-center gap-2 ${
                  isBookmarked ? "bg-amber-400 text-muted" : "bg-background hover:bg-background"
                } px-4 py-2 rounded-md transition-colors duration-200`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark size={18} className={isBookmarked ? "fill-black" : ""} />
                <span>{isBookmarked ? "Saved" : "Save"}</span>
              </button>
            </div>
            <div className="text-sm text-muted-foreground">Narrative: {newsItem.contentType}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsAnalysisDetails;
