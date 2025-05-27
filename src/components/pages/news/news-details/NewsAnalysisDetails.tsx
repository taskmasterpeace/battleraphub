import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Brain, Calendar, Share2, Target } from "lucide-react";
import { NewsItem } from "@/types";
import { Button } from "@/components/ui/button";

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
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1 px-3 bg-accent py-1.5 rounded-full text-sm">
              <Brain size={16} />
              <span>AI Analysis</span>
            </div>
            <div className="bg-amber-400 text-accent-foreground-foreground px-3 py-1.5 rounded-full text-sm font-medium">
              {newsItem.league}
            </div>
            <div className="flex items-center gap-1 bg-accent px-3 py-1.5 rounded-full text-sm">
              <Calendar size={16} />
              <span>{newsItem.event_date}</span>
            </div>
            <div className="flex items-center gap-1 bg-accent px-3 py-1.5 rounded-full text-sm">
              <span>📍 {newsItem.location}</span>
            </div>
            <div className="flex items-center gap-1 bg-accent px-3 py-1.5 rounded-full text-sm">
              <Target size={16} />
              <span>Cultural Impact: {newsItem.cultural_significance.score}/10</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{newsItem.headline}</h1>

          {/* Main Event Info */}
          <div className="bg-gradient-to-r from-amber-400/20 to-purple-600/20 rounded-xl p-6 mb-6 border border-amber-400/30">
            <h2 className="text-xl font-bold mb-2 text-amber-400">{newsItem.main_event.title}</h2>
            <p className="text-muted-foreground">{newsItem.main_event.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {newsItem.tags.map((tag: string) => (
              <div
                key={tag}
                className="bg-accent px-3 py-2 rounded-lg hover:bg-muted/70 transition-colors duration-200 cursor-pointer"
              >
                <div className="text-sm font-medium text-accent-foreground">{tag}</div>
              </div>
            ))}
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-6 border-b border-border">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">👍</span>
                <span className="text-2xl font-bold text-accent-foreground-foreground">
                  {newsItem.community_reaction.engagement_metrics.likes}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🔄</span>
                <span className="text-2xl font-bold text-accent-foreground">
                  {newsItem.community_reaction.engagement_metrics.retweets}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Retweets</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              {newsItem.executive_summary.title}
            </h2>
            <div className="bg-accent rounded-xl p-6 border-l-4 border-amber-400">
              <p className="text-muted-foreground">{newsItem.executive_summary.body}</p>
            </div>
          </div>

          {/* Format Innovation */}
          {newsItem.format_innovation && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                {newsItem.format_innovation.title}
              </h2>
              <div className="bg-accent rounded-xl p-6 mb-4">
                <p className="text-muted-foreground mb-4">
                  {newsItem.format_innovation.description}
                </p>
                <div className="bg-background rounded-lg p-4 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-accent-foreground-foreground font-bold text-sm">
                      "
                    </div>
                    <p className="text-muted-foreground italic flex-1">
                      {newsItem.format_innovation.quote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Community Reaction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Community Reaction
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-accent rounded-xl p-6">
                <h3 className="font-bold mb-3">Overall Sentiment</h3>
                <div
                  className={`text-3xl font-bold mb-2 ${
                    newsItem.community_reaction.overall_sentiment === "Positive"
                      ? "text-success"
                      : newsItem.community_reaction.overall_sentiment === "Negative"
                        ? "text-destructive"
                        : "text-yellow-400"
                  }`}
                >
                  {newsItem.community_reaction.overall_sentiment}
                </div>
                <p className="text-muted-foreground text-sm">Community response to this event</p>
              </div>
              <div className="bg-accent rounded-xl p-6">
                <h3 className="font-bold mb-3">Cultural Significance</h3>
                <div className="text-3xl font-bold mb-2 text-amber-400">
                  {newsItem.cultural_significance.score}/10
                </div>
                <p className="text-muted-foreground text-sm">
                  {newsItem.cultural_significance.narrative}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-accent rounded-xl p-6">
              <p className="text-muted-foreground">{newsItem.community_reaction.summary}</p>
            </div>
          </div>

          {/* Social Impact */}
          {newsItem.social_impact && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
                Social Impact: {newsItem.social_impact.highlight}
              </h2>
              <div className="bg-accent rounded-xl p-6 mb-4">
                <p className="text-muted-foreground mb-4">
                  {newsItem.social_impact.community_response}
                </p>
                <div className="bg-background rounded-lg p-4 border-l-4 border-destructive">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
                      ❤️
                    </div>
                    <p className="text-muted-foreground italic flex-1">
                      {newsItem.social_impact.quote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notable Content */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              Notable Content
            </h2>
            <div className="space-y-4">
              {newsItem.notable_content.map((content: string, index: number) => (
                <div key={index} className="bg-accent rounded-xl p-6 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-accent-foreground-foreground font-bold text-sm">
                      "
                    </div>
                    <p className="text-muted-foreground italic flex-1">{content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Predictions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
              AI Predictions
            </h2>
            <div className="space-y-3">
              {newsItem.ai_predictions.map((prediction: string, index: number) => (
                <div key={index} className="flex items-start gap-3 bg-accent rounded-lg p-4">
                  <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-accent-foreground-foreground text-sm font-bold">
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
              {newsItem.actions.share_enabled && (
                <Button className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-muted/80 px-4 py-2 rounded-md transition-colors duration-200">
                  <Share2 size={18} />
                  <span>Share Analysis</span>
                </Button>
              )}
              {newsItem.actions.save_enabled && (
                <Button
                  className={`flex items-center gap-2 ${
                    !isBookmarked
                      ? "bg-amber-400 text-accent-foreground hover:bg-amber-400/70"
                      : "bg-accent hover:bg-accent/70"
                  } px-4 py-2 rounded-md transition-colors duration-200`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark size={18} className={isBookmarked ? "fill-black" : ""} />
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground">Type: {newsItem.actions.narrative}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsAnalysisDetails;
