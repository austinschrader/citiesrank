import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useState } from "react";

const ITEMS_PER_PAGE = 50;

export function usePagination(filteredCities: CitiesResponse[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedData = () => {
    return filteredCities.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  };

  const getTotalPages = () => {
    return Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
  };

  return {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    getTotalPages,
  };
}
