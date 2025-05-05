"use client";

import React, { useCallback, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingCard from "@/components/pages/my-ratings/RatingCard";
import { supabase } from "@/utils/supabase/client";
import { MyRating } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { RPC_FUNCTIONS } from "@/config";

const ITEMS_PER_PAGE = 10;

const MyRatings = () => {
  const { user } = useAuth();
  const [ratingData, setRatingData] = useState<MyRating[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRatingsCount = useCallback(async () => {
    const { data } = await supabase.rpc(RPC_FUNCTIONS.ALL_MY_RATINGS_BATTLERS, {
      p_user_id: user?.id,
    });

    return data?.length || 0;
  }, [user?.id]);

  const fetchRatingsData = useCallback(
    async (page: number, itemsPerPage: number) => {
      setLoading(true);
      try {
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        const { data } = await supabase
          .rpc(RPC_FUNCTIONS.ALL_MY_RATINGS_BATTLERS, {
            p_user_id: user?.id,
          })
          .range(from, to);
        setRatingData(data || []);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const { currentPage, totalPages, handlePageChange } = usePagination({
    itemsPerPage: ITEMS_PER_PAGE,
    fetchCount: fetchRatingsCount,
    fetchData: fetchRatingsData,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Ratings</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-6 bg-gray-900 border border-gray-800">
          <TabsTrigger value="all">All Ratings</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="highest">Highest Rated</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full bg-gray-800 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-800 w-32 mb-2 animate-pulse"></div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-4 bg-gray-800 w-20 animate-pulse"></div>
                            <div className="h-3 bg-gray-800 w-32 animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 mt-4 md:mt-0">
                        <div className="flex flex-wrap gap-2">
                          {[...Array(3)].map((_, index) => (
                            <div
                              key={index}
                              className="w-24 h-8 bg-gray-800 animate-pulse rounded-lg"
                            ></div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <div className="w-24 h-8 bg-gray-800 animate-pulse rounded-lg"></div>
                        <div className="w-24 h-8 bg-gray-800 animate-pulse rounded-lg"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : ratingData.length > 0 ? (
              ratingData.map((rating, index) => <RatingCard key={index} rating={rating} />)
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-400">No Data Found</p>
                </CardContent>
              </Card>
            )}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.max(1, currentPage - 1));
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(Math.min(totalPages, currentPage + 1));
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="space-y-6">
            {ratingData
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5)
              .map((rating, index) => (
                <RatingCard key={index} rating={rating} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="highest">
          <div className="space-y-6">
            {ratingData
              .sort((a, b) => b.average_score - a.average_score)
              .slice(0, 5)
              .map((rating, index) => (
                <RatingCard key={index} rating={rating} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default MyRatings;
