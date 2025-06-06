"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TrendingBattlers from "@/components/pages/landing/TrendingBattlers";
import CommunityPulse from "@/components/pages/landing/CommunityPulse";
import SpotlightAnalytics from "@/components/pages/landing/SpotlightAnalytics";
import HighlightedBattler from "@/components/pages/landing/HighlightedBattler";
import RankingSystem from "@/components/pages/landing/RankingSystem";
import MediaHighlight from "@/components/pages/landing/MediaHighlight";
import HeroSection from "@/components/pages/landing/HeroSection";
import { useHome } from "@/contexts/home.context";
import { PAGES } from "@/config";

const HomePage = () => {
  const { recentBattlers, recentBattlerLoading } = useHome();

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Hero Section with YouTube Feature */}
      <HeroSection />

      {/* Highlighted Battler and Rankings side by side */}
      <section className="py-6 md:py-8 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Highlighted Battler */}
          <div className="flex flex-col h-full min-h-[600px]">
            <HighlightedBattler />
          </div>

          {/* Champion Rankings */}
          <div className="flex flex-col h-full min-h-[600px]">
            <RankingSystem compact={true} showTitle={undefined} />
          </div>
        </div>
      </section>

      {/* Recent Battlers Section */}
      <section className="py-6 md:py-8 border-t border-border">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold">Recently Added Battlers</h2>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href={PAGES.BATTLERS}>View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recentBattlerLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background rounded-lg overflow-hidden border border-border animate-pulse"
                >
                  <div className="aspect-square relative bg-background/80" />
                  <div className="p-3">
                    <div className="h-4 bg-background/70 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-background/70 rounded w-1/2 mb-4" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[...Array(3)].map((_, i) => (
                        <span key={i} className="h-4 w-12 bg-background/70 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            : recentBattlers.slice(0, 6).map((battler) => (
                <Link
                  key={battler.id}
                  href={`${PAGES.BATTLERS}/${battler.id}`}
                  className="bg-background rounded-lg overflow-hidden border border-border hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-900/20"
                >
                  <div className="aspect-square relative max-h-[206px] max-w-[206px]">
                    <Image
                      src={battler.avatar || "/image/default-avatar-img.jpg"}
                      alt={battler.name || "Battler Avatar"}
                      width={206}
                      height={206}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm sm:text-base">{battler.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{battler.location}</p>
                  </div>
                </Link>
              ))}
        </div>
        <div className="mt-4 flex sm:hidden justify-center">
          <Button asChild variant="outline" className="w-full">
            <Link href={PAGES.BATTLERS}>View All Battlers</Link>
          </Button>
        </div>
      </section>

      {/* Media Highlight Section */}
      <section className="py-6 md:py-8 border-t border-border">
        <MediaHighlight />
      </section>

      {/* Trending Battlers Section */}
      <section className="py-6 md:py-8 border-t border-border">
        <TrendingBattlers />
      </section>

      {/* Spotlight Analytics Section */}
      <section className="py-6 md:py-8 border-t border-border">
        <SpotlightAnalytics />
      </section>

      {/* Community Pulse Section */}
      <section className="py-6 md:py-8 border-t border-border">
        <CommunityPulse />
      </section>

      {/* Features Section */}
      <section className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-border">
        <div className="bg-background p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-amber-400">
            Rate Performances
          </h3>
          <p className="text-sm md:text-base text-foreground/50">
            Rate battlers on writing, performance, and personal attributes with detailed metrics
          </p>
        </div>
        <div className="bg-background p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-blue-400">Assign Badges</h3>
          <p className="text-sm md:text-base text-foreground/50">
            Highlight strengths and weaknesses with specific badges that define a battler's style
          </p>
        </div>
        <div className="bg-background p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-primary">View Analytics</h3>
          <p className="text-sm md:text-base text-foreground/50">
            Compare your ratings with community averages and track battler progress over time
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
