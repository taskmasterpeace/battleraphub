"use client";

import { DB_TABLES } from "@/config";
import { NewsItem } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

type NewsContextType = {
  newsItems: NewsItem[];
  newsItemsLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const NewsContext = createContext<NewsContextType>({
  newsItems: [],
  newsItemsLoading: false,
  searchQuery: "",
  setSearchQuery: () => {},
});

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsItemsLoading, setNewsItemsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getNewsContentData = useCallback(async () => {
    try {
      setNewsItemsLoading(true);
      const ilikeQuery = `%${searchQuery}%`;

      let query = supabase
        .from(DB_TABLES.NEWS_CONTENTS)
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery.trim() !== "") {
        query = query.or(
          [
            `headline.ilike.${ilikeQuery}`,
            `league.ilike.${ilikeQuery}`,
            `executive_summary->>body.ilike.${ilikeQuery}`,
            `core_topics.cs.{${searchQuery}}`,
            `tags.cs.{${searchQuery}}`,
          ].join(","),
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching news content data:", error);
        return;
      }

      setNewsItems(data || []);
    } catch (error) {
      console.error("Error fetching news content data:", error);
    } finally {
      setNewsItemsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    getNewsContentData();
  }, [getNewsContentData]);

  return (
    <NewsContext.Provider
      value={{
        newsItems,
        newsItemsLoading,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
};
