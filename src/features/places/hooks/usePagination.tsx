import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export function usePagination(getFilteredData: () => CitiesResponse[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<CitiesResponse[]>([]);

  // Update filtered data whenever the filter function changes
  useEffect(() => {
    setFilteredData(getFilteredData());
    setCurrentPage(1); // Reset to first page when filter changes
  }, [getFilteredData]);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
    }, 500);
  };

  const getPaginatedData = () => {
    return filteredData.slice(0, currentPage * ITEMS_PER_PAGE);
  };

  const hasMore = () => {
    return currentPage * ITEMS_PER_PAGE < filteredData.length;
  };

  return {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading,
  };
}
