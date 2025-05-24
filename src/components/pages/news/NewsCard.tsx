import Link from "next/link";
import { motion } from "framer-motion";
import { KeyFigure, NewsItem } from "@/types";

interface NewsCardProps {
  item: NewsItem;
  contentTypes: { name: string; icon: string }[];
  categories: { id: string; name: string }[];
}

export function NewsCard({ item, contentTypes, categories }: NewsCardProps) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * item.id }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/news/${item.id}`} className="block h-full">
        <div className="bg-background rounded-xl overflow-hidden border border-border h-full shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="relative h-32 bg-gradient-to-br from-amber-400/20 to-purple-600/20 flex items-center justify-center">
            <div className="text-4xl">
              {contentTypes.find((type) => type.name === item.contentType)?.icon || "📰"}
            </div>
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
              {item.contentType}
            </div>
            <div className="absolute top-2 right-2 bg-amber-400 text-muted px-2 py-1 rounded text-xs font-medium">
              {categories.find((c) => c.id === item.category)?.name || item.category}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold mb-2 group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
              {item.headline}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.summary}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.key_figures.slice(0, 2).map((figure: KeyFigure) => (
                <span
                  key={figure.name}
                  className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground"
                  title={figure.role}
                >
                  {figure.name}
                </span>
              ))}
              {item.key_figures.length > 2 && (
                <span className="text-xs bg-background px-2 py-1 rounded-full text-muted-foreground">
                  +{item.key_figures.length - 2}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cultural Impact</span>
                <span className="text-amber-400">{item.cultural_significance}/10</span>
              </div>
              <div className="w-full bg-background rounded-full h-1">
                <div
                  className="bg-amber-400 h-1 rounded-full"
                  style={{ width: `${(item.cultural_significance / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <div className="flex items-center gap-1">
                  <span>Sentiment: {item.community_reaction.sentiment}</span>
                </div>
              </div>
              <span className="text-muted-foreground text-xs">{item.time}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
