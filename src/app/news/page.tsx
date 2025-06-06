import News from "@/components/pages/news";
import { NewsProvider } from "@/contexts/news.context";
import React from "react";

const NewsPage = () => {
  return (
    <NewsProvider>
      <News />
    </NewsProvider>
  );
};

export default NewsPage;
