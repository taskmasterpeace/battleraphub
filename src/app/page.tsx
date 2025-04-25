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
import { recentBattlers } from "@/__mocks__/landing";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Hero Section with YouTube Feature */}
      <HeroSection />

      {/* Highlighted Battler and Rankings side by side */}
      <section className="py-6 md:py-8 border-t border-gray-800">
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
      <section className="py-6 md:py-8 border-t border-gray-800">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold">Recently Added Battlers</h2>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/battlers">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recentBattlers.map((battler) => (
            <Link
              key={battler.id}
              href={`/battlers/${battler.id}`}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-900/20"
            >
              <div className="aspect-square relative">
                <Image
                  src={battler.image || "/image/default-avatar-img.jpg"}
                  alt={battler.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm sm:text-base">{battler.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{battler.location}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex sm:hidden justify-center">
          <Button asChild variant="outline" className="w-full">
            <Link href="/battlers">View All Battlers</Link>
          </Button>
        </div>
      </section>

      {/* Media Highlight Section */}
      <section className="py-6 md:py-8 border-t border-gray-800">
        <MediaHighlight />
      </section>

      {/* Trending Battlers Section */}
      <section className="py-6 md:py-8 border-t border-gray-800">
        <TrendingBattlers />
      </section>

      {/* Spotlight Analytics Section */}
      <section className="py-6 md:py-8 border-t border-gray-800">
        <SpotlightAnalytics />
      </section>

      {/* Community Pulse Section */}
      <section className="py-6 md:py-8 border-t border-gray-800">
        <CommunityPulse />
      </section>

      {/* Features Section */}
      <section className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-gray-800">
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-amber-400">
            Rate Performances
          </h3>
          <p className="text-sm md:text-base text-gray-300">
            Rate battlers on writing, performance, and personal attributes with detailed metrics
          </p>
        </div>
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-blue-400">Assign Badges</h3>
          <p className="text-sm md:text-base text-gray-300">
            Highlight strengths and weaknesses with specific badges that define a battler's style
          </p>
        </div>
        <div className="bg-gray-900 p-4 md:p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-purple-400">
            View Analytics
          </h3>
          <p className="text-sm md:text-base text-gray-300">
            Compare your ratings with community averages and track battler progress over time
          </p>
        </div>
      </section>
    </div>
  );
}
