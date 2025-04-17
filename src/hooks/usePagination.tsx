import { useCallback, useEffect, useState } from "react";

interface PaginationProps {
  itemsPerPage: number;
  fetchCount: () => Promise<number>;
  fetchData: (page: number, itemsPerPage: number) => Promise<void>;
}

export const usePagination = ({ itemsPerPage, fetchCount, fetchData }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getTotalCount = useCallback(async () => {
    const count = await fetchCount();
    setTotalCount(count);
  }, [fetchCount]);

  const resetCount = (totalCount: number) => {
    setCurrentPage(1);
    setTotalCount(totalCount);
  };

  useEffect(() => {
    getTotalCount();
  }, [getTotalCount]);

  useEffect(() => {
    fetchData(1, itemsPerPage);
  }, [fetchData, itemsPerPage]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchData(page, itemsPerPage);
  };

  return {
    currentPage,
    totalPages,
    handlePageChange,
    resetCount,
  };
};
