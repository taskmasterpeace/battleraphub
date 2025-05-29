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
  loadMoreNews: () => Promise<void>;
  hasMore: boolean;
};

const NewsContext = createContext<NewsContextType>({
  newsItems: [],
  newsItemsLoading: false,
  searchQuery: "",
  setSearchQuery: () => {},
  loadMoreNews: async () => {},
  hasMore: false,
});

export const NewsProvider = ({ children }: { children: React.ReactNode }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsItemsLoading, setNewsItemsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const itemsPerPage = 6; // Number of items to load each time
  const initialLoadCount = 9; // Initial number of items to show

  const fetchNewsItems = useCallback(
    async (currentPage: number, isInitialLoad = false) => {
      try {
        setNewsItemsLoading(true);
        const ilikeQuery = `%${searchQuery}%`;
        const offset = isInitialLoad
          ? 0
          : (currentPage - 1) * itemsPerPage + (initialLoadCount - itemsPerPage);
        const limit = isInitialLoad ? initialLoadCount : itemsPerPage;

        let query = supabase
          .from(DB_TABLES.NEWS_CONTENTS)
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (searchQuery.trim() !== "") {
          query = query.or(
            [
              `headline.ilike.${ilikeQuery}`,
              `tags.cs.{${searchQuery}}`,
              `main_content.ilike.${ilikeQuery}`,
            ].join(","),
          );
        }

        const { data: newsItemsData, error, count } = await query;

        if (error) {
          console.error("Error fetching news content data:", error);
          return { data: [], hasMore: false };
        }

        return {
          data: newsItemsData || [],
          hasMore: count ? offset + limit < count : false,
        };
      } catch (error) {
        console.error("Error in fetchNewsItems:", error);
        return { data: [], hasMore: false };
      } finally {
        setNewsItemsLoading(false);
      }
    },
    [searchQuery],
  );

  const getNewsContentData = useCallback(async () => {
    const { data, hasMore } = await fetchNewsItems(1, true);
    setNewsItems(data);
    setPage(1);
    setHasMore(hasMore);
  }, [fetchNewsItems]);

  const loadMoreNews = useCallback(async () => {
    if (newsItemsLoading || !hasMore) return;

    const nextPage = page + 1;
    const { data, hasMore: moreAvailable } = await fetchNewsItems(nextPage);

    setNewsItems((prev) => [...prev, ...data]);
    setPage(nextPage);
    setHasMore(moreAvailable);
  }, [page, hasMore, newsItemsLoading, fetchNewsItems]);

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
        loadMoreNews,
        hasMore,
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
