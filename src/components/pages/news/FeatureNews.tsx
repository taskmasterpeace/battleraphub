import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useNews } from "@/contexts/news.context";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const FeatureNews = () => {
  const { newsItems: filteredNews, loadMoreNews, newsItemsLoading, hasMore } = useNews();
  return (
    <section className="w-full py-16">
      <div className="container px-4 mx-auto">
        {filteredNews?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Featured Item */}
            {filteredNews?.map((story) => (
              <motion.div
                key={story?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-2 lg:col-span-1 group"
              >
                <Link href={`/news/${story?.id}`} className="block h-full">
                  <div className="bg-card-background rounded-xl overflow-hidden border border-border hover:border-amber-400/50 transition-all duration-300 h-full shadow-lg hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={"/placeholder.svg"}
                        alt={story?.headline || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{story?.reading_time}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors duration-200 line-clamp-2 max-w-[380px]">
                        {story?.headline}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {story?.blurb}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {story?.tags?.slice(0, 2)?.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-amber-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300 text-sm sm:w-auto min-w-[100px]">
                          Read Story
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="bg-background rounded-xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-muted-foreground">
              No analysis found matching your search criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* Load More Button */}
      {filteredNews?.length > 0 && hasMore && (
        <div className="text-center mt-12">
          <Button
            className="bg-amber-400 hover:bg-amber-500 text-background font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 h-12 text-base"
            onClick={loadMoreNews}
            disabled={newsItemsLoading}
          >
            Load More Stories
          </Button>
        </div>
      )}
    </section>
  );
};

export default FeatureNews;
