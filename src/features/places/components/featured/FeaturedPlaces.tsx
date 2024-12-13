import { Button } from "@/components/ui/button";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { usePagination } from "@/features/places/hooks/usePagination";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { useEffect } from "react";
import { PlaceCard } from "../cards/PlaceCard";

export const FeaturedPlaces = () => {
  const { cities } = useCities();
  const { filters, setFilter, resetFilters } = useFilters();

  // Reset filters when component unmounts
  useEffect(() => {
    return () => resetFilters();
  }, [resetFilters]);

  // Filter types for quick access
  const filterTypes = [
    { id: CitiesTypeOptions.city, label: "Cities" },
    { id: CitiesTypeOptions.region, label: "Regions" },
    { id: CitiesTypeOptions.country, label: "Countries" },
    { id: CitiesTypeOptions.neighborhood, label: "Neighborhoods" },
    { id: CitiesTypeOptions.sight, label: "Sights" },
  ];

  const filteredCities = cities.filter(
    (city) => !filters.placeType || city.type === filters.placeType
  );

  const {
    getPaginatedData,
    loadMore,
    hasMore,
    isLoading: isLoadingMore,
  } = usePagination(filteredCities);

  const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16">
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {filterTypes.map((type) => (
          <Button
            key={type.id}
            variant={filters.placeType === type.id ? "default" : "outline"}
            onClick={() =>
              setFilter(
                "placeType",
                filters.placeType === type.id ? null : type.id
              )
            }
            className="whitespace-nowrap"
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Place Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getPaginatedData().map((city) => (
          <PlaceCard key={city.id} city={city} variant="basic" />
        ))}
      </div>

      {/* Infinite Scroll Observer */}
      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
};
