"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Copy, Facebook, Instagram, Twitter } from "lucide-react";
import { NewsItem } from "@/types";
import LoadingSpinner from "./LoadingSpinner";
import NotFound from "./NotFound";
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES, PAGES } from "@/config";
import useSWR from "swr";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

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
      <main className="min-h-screen bg-background text-accent-foreground">
        {/* Navigation */}
        <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md mt-[1px] border-b border-border">
          <div className="container mx-auto px-4 sm:py-4 py-2">
            <Button
              variant="ghost"
              onClick={() => router.push(PAGES.NEWS)}
              className="flex items-center text-muted-foreground hover:!text-amber-400 text-base transition-colors duration-200 hover:!bg-transparent"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to news</span>
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <Image
            src={"/placeholder.svg"}
            alt={newsItem?.headline || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040b14] via-[#040b14]/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container mx-auto sm:pb-8 pb-4">
            <div className="max-w-4xl">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight text-primary-foreground">
                {newsItem?.headline}
              </h1>
              <p className="text-base sm:text-xl text-primary-foreground mb-6 leading-relaxed">
                {newsItem?.blurb}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <article className="bg-muted rounded-xl sm:p-8 p-4 border border-border text-foreground">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-4 text-sm text-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(newsItem?.created_at || "")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{newsItem?.reading_time}</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="article-content max-w-none mb-8 text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: newsItem?.main_content || "" }} />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {newsItem?.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-background px-3 py-1 rounded-full text-sm transition-colors duration-200 cursor-pointer text-foreground border border-border"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground mr-2">Share:</span>
                  <Button
                    variant="default"
                    className="p-2 h-full bg-background rounded-lg transition-colors duration-200 text-foreground border border-border"
                  >
                    <Twitter size={16} />
                  </Button>
                  <Button
                    variant="default"
                    className="p-2 h-full bg-background rounded-lg transition-colors duration-200 text-foreground border border-border"
                  >
                    <Facebook size={16} />
                  </Button>
                  <Button
                    variant="default"
                    className="p-2 h-full bg-background rounded-lg transition-colors duration-200 text-foreground border border-border"
                  >
                    <Instagram size={16} />
                  </Button>
                  <Button
                    variant="default"
                    className="p-2 h-full bg-background rounded-lg transition-colors duration-200 text-foreground border border-border"
                  >
                    <Copy
                      size={16}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast("Link copied to clipboard");
                      }}
                    />
                  </Button>
                </div>
              </article>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewsDetails;
