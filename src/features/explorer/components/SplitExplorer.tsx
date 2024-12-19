import { MapPlace } from "@/features/map/types";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  isInPopulationRange,
  PopulationCategory,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResultsPanel } from "./ResultsPanel";
import { MapLegend } from "./MapLegend";
import { CityMap } from "@/features/map/components/CityMap";

const ITEMS_PER_PAGE = 12;
const DEFAULT_RATING = 4.6;

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, setFilters } = useFilters();
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<MapPlace[]>([]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

  // Use all place types by default
  const [activeTypes, setActiveTypes] = useState<CitiesTypeOptions[]>(
    Object.values(CitiesTypeOptions)
  );

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating) count++;
    if (filters.populationCategory) count++;
    return count;
  }, [filters]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      averageRating: null,
      populationCategory: null,
    });
  }, [setFilters]);

  // Filter places based on active types, rating, population, and search
  const filteredPlaces = useMemo(() => {
    return cities.filter((place) => {
      const typeMatch = activeTypes.includes(place.type as CitiesTypeOptions);
      const ratingMatch =
        !filters.averageRating ||
        (place.averageRating && place.averageRating >= filters.averageRating);
      const populationMatch =
        !filters.populationCategory ||
        isInPopulationRange(place.population, filters.populationCategory);
      const searchMatch =
        !filters.search ||
        place.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        place.description
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        place.type?.toLowerCase().includes(filters.search.toLowerCase());

      return typeMatch && ratingMatch && populationMatch && searchMatch;
    });
  }, [
    cities,
    activeTypes,
    filters.averageRating,
    filters.populationCategory,
    filters.search,
  ]);

  // Calculate places in current view
  const placesInView = useMemo(() => {
    if (!mapBounds) return filteredPlaces;

    return filteredPlaces.filter((place) => {
      if (
        typeof place.latitude !== "number" ||
        typeof place.longitude !== "number"
      )
        return false;
      return mapBounds.contains([place.latitude, place.longitude]);
    });
  }, [filteredPlaces, mapBounds]);

  // Get paginated places
  const paginatedPlaces = useMemo(() => {
    return filteredPlaces.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredPlaces, page]);

  const hasMore = useCallback(() => {
    return paginatedPlaces.length < filteredPlaces.length;
  }, [paginatedPlaces.length, filteredPlaces.length]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore]);

  const handleRatingChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!value) {
      setFilters({ averageRating: null });
    } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFilters({ averageRating: numValue });
    }
  };

  const handlePopulationSelect = (category: PopulationCategory | null) => {
    if (category) {
      setActiveTypes([CitiesTypeOptions.city]);
      setFilters({ populationCategory: category });
    } else {
      setFilters({ populationCategory: null });
    }
  };

  const handleTypeClick = (type: CitiesTypeOptions) => {
    // Clear population filter if selecting a non-city type
    if (type !== CitiesTypeOptions.city && filters.populationCategory) {
      setFilters({ populationCategory: null });
    }

    // Toggle the type in activeTypes
    setActiveTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];

      // If all types are removed, restore all types
      return newTypes.length === 0
        ? Object.values(CitiesTypeOptions)
        : newTypes;
    });
  };

  // Set default rating on mount
  useEffect(() => {
    if (filters.averageRating === null) {
      setFilters({ averageRating: DEFAULT_RATING });
    }
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore() && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <div className="h-screen flex">
      <ResultsPanel
        filteredPlaces={filteredPlaces}
        paginatedPlaces={paginatedPlaces}
        filters={filters}
        setFilters={setFilters}
        activeFilterCount={activeFilterCount}
        clearAllFilters={clearAllFilters}
        handleRatingChange={handleRatingChange}
        handlePopulationSelect={handlePopulationSelect}
        isLoadingMore={isLoadingMore}
        observerTarget={observerTarget}
        isResultsPanelCollapsed={isResultsPanelCollapsed}
        setIsResultsPanelCollapsed={setIsResultsPanelCollapsed}
      />
      <div className="flex-1 relative">
        <MapLegend
          filteredPlaces={filteredPlaces}
          placesInView={placesInView}
          mapBounds={mapBounds}
          filters={filters}
          activeTypes={activeTypes}
          isStatsMinimized={isStatsMinimized}
          setIsStatsMinimized={setIsStatsMinimized}
          handleTypeClick={handleTypeClick}
          handlePopulationSelect={handlePopulationSelect}
        />
        <CityMap
          places={filteredPlaces}
          onBoundsChange={setMapBounds}
          className="h-full w-full"
          onPlaceSelect={setSelectedPlace}
        />
      </div>
    </div>
  );
};
