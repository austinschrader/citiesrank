import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

type GeographicLevel = "country" | "region" | "city" | "neighborhood" | "sight";

export function usePagination(
  geographicLevel: GeographicLevel,
  filteredCities: CitiesResponse[],
  sampleData: Record<GeographicLevel, any[]>
) {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedData = () => {
    if (geographicLevel === "city") {
      return filteredCities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );
    }
    return sampleData[geographicLevel].slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  };

  const getTotalPages = () => {
    if (geographicLevel === "city") {
      return Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
    }
    return Math.ceil(sampleData[geographicLevel].length / ITEMS_PER_PAGE);
  };

  return {
    currentPage,
    setCurrentPage,
    getPaginatedData,
    getTotalPages,
  };
}
