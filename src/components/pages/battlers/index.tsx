"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import QuickFilterBar from "@/components/pages/battlers/QuickFilterBar";
import type { Battlers, TagsOption } from "@/types";
import { DB_TABLES, PAGES, RPC_FUNCTIONS } from "@/config";
import { supabase } from "@/utils/supabase/client";
import { usePagination } from "@/hooks/usePagination";
import {
  Pagination,
  PaginationItem,
  PaginationContent,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 10;

export default function Battlers({ tags }: { tags: TagsOption[] }) {
  const [battlers, setBattlers] = useState<Battlers[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBattlersCount = useCallback(async () => {
    const query = supabase.from(DB_TABLES.BATTLERS).select("id", { count: "exact", head: true });
    const { count, error } = await query;
    if (error) {
      console.error("Error fetching battlers count:", error);
      return 0;
    }
    return count || 0;
  }, []);

  const fetchBattlers = useCallback(
    async (page: number, itemsPerPage: number, filters?: { search: string; tags: number[] }) => {
      // If we have tag filters or search filter, use the RPC function for efficient filtering
      setLoading(true);
      try {
        if (
          (filters?.tags && filters.tags.length > 0) ||
          (filters?.search && filters.search.trim() !== "")
        ) {
          try {
            // Use the RPC function to get battlers with filters
            const { data: filteredBattlers, error: rpcError } = await supabase.rpc(
              RPC_FUNCTIONS.BATTLER_FILTER,
              {
                tags: filters?.tags || [],
                search_name: filters?.search || "",
                limitnum: itemsPerPage,
                offsetnum: (page - 1) * itemsPerPage,
              },
            );

            if (rpcError) {
              console.error("Error filtering battlers:", rpcError);
              return;
            }

            if (!filteredBattlers || filteredBattlers.length === 0) {
              setBattlers([]);
              return;
            }

            // Fetch only the tags for these battlers
            const { data: battlerTags, error: tagsError } = await supabase
              .from(DB_TABLES.BATTLERS_TAGS)
              .select(
                `
            battler_id,
            tags (
              id,
              name
            )
          `,
              )
              .in(
                "battler_id",
                filteredBattlers.map((battler: { id: number }) => battler.id),
              );

            if (tagsError) {
              console.error("Error fetching battler tags:", tagsError);
              return;
            }

            // Map the tags to their respective battlers
            const battlersWithTags = filteredBattlers.map(
              (battler: {
                id: number;
                name: string;
                avatar: string;
                location: string;
                bio: string;
                users: { added_by: string };
              }) => ({
                ...battler,
                battler_tags: battlerTags
                  .filter((tag) => tag.battler_id === battler.id)
                  .map((tag) => ({
                    tags: tag.tags,
                  })),
              }),
            );

            setBattlers(battlersWithTags as Battlers[]);
            return;
          } catch (error) {
            console.error("Unexpected error in filtering:", error);
            return;
          } finally {
            setLoading(false);
          }
        }

        // For regular queries (no filters), use the standard approach
        const projection = `
      *,
      battler_tags (
        tags (
          id,
          name
        )
      )
    `;

        const query = supabase
          .from(DB_TABLES.BATTLERS)
          .select(projection)
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching battlers:", error);
          return;
        }

        setBattlers(data as Battlers[]);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const { currentPage, totalPages, handlePageChange, resetCount } = usePagination({
    itemsPerPage: ITEMS_PER_PAGE,
    fetchCount: fetchBattlersCount,
    fetchData: fetchBattlers,
  });

  // Add this function to handle filter changes
  const handleFilterChange = useMemo(
    () =>
      debounce(async (filters: { search: string; tags: number[] }) => {
        let count = 0;
        if (!filters.tags.length && !filters.search) {
          count = await fetchBattlersCount();
          resetCount(count);
        } else {
          // Get the count for pagination
          const { data, error: countError } = await supabase.rpc(
            RPC_FUNCTIONS.BATTLER_FILTER_COUNT,
            {
              tags: filters.tags,
              search_name: filters.search,
            },
          );

          if (countError) {
            console.error("Error getting count for filtered battlers:", countError);
          }
          resetCount(data[0].count);
        }
        // In a real app, this would filter the battlers
        fetchBattlers(1, ITEMS_PER_PAGE, filters);
      }, 500),
    [fetchBattlersCount, resetCount, fetchBattlers],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">All Battlers</h1>

      {/* Add the QuickFilterBar component */}
      <div className="mb-6">
        <QuickFilterBar tags={tags} onFilterChange={handleFilterChange} />
      </div>

      {/* Battlers grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-background rounded-lg overflow-hidden border border-border animate-pulse"
              >
                <div className="aspect-square relative bg-muted" />
                <div className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className="h-4 w-12 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ))
          : battlers.map((battler) => (
              <Link
                key={battler.id}
                href={`${PAGES.BATTLERS}/${battler.id}`}
                className="bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-purple-900/20"
              >
                <div className="aspect-square relative max-w-[206px] max-h-[206px]">
                  <Image
                    src={battler.avatar || "/image/default-avatar-img.jpg"}
                    alt={battler?.name || "Battler Avatar"}
                    width={206}
                    height={206}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{battler.name}</h3>
                  <p className="text-sm text-muted-foreground">{battler.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {battler?.battler_tags?.map((tag) => (
                      <span key={tag.tags.id} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {tag.tags.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
      </div>
      <div className="py-5">
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
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
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
    </div>
  );
}
