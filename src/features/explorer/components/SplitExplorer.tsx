import { CityMap } from "@/features/map/components/CityMap";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLegend } from "./MapLegend";
import { ResultsPanel } from "./ResultsPanel";

const ITEMS_PER_PAGE = 10;
const DEFAULT_RATING = 4.6;

export const SplitExplorer = () => {
  const { cities } = useCities();
  const {
    filters,
    setFilters,
    handleTypeClick,
    handlePopulationSelect,
    resetFilters,
    getFilteredCities,
  } = useFilters();
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating) count++;
    if (filters.populationCategory) count++;
    return count;
  }, [filters]);

  // Get filtered places using context
  const filteredPlaces = useMemo(() => {
    return getFilteredCities(cities, (city) => ({
      matchScore: 1,
      attributeMatches: {
        budget: 1,
        crowds: 1,
        tripLength: 1,
        season: 1,
        transit: 1,
        accessibility: 1,
      },
    }));
  }, [cities, getFilteredCities]);

  // Calculate places in current view
  const placesInView = useMemo(() => {
    if (!mapBounds) return filteredPlaces;
    return filteredPlaces.filter((place) => {
      if (!place.latitude || !place.longitude) return false;
      return mapBounds.contains([place.latitude, place.longitude]);
    });
  }, [filteredPlaces, mapBounds]);

  // Get paginated places
  const paginatedPlaces = useMemo(() => {
    return placesInView.slice(0, page * ITEMS_PER_PAGE);
  }, [placesInView, page]);

  const hasMore = useCallback(() => {
    return paginatedPlaces.length < placesInView.length;
  }, [paginatedPlaces.length, placesInView.length]);

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
        filteredPlaces={placesInView}
        paginatedPlaces={paginatedPlaces}
        filters={filters}
        setFilters={setFilters}
        activeFilterCount={activeFilterCount}
        clearAllFilters={resetFilters}
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
          activeTypes={filters.activeTypes}
          isStatsMinimized={isStatsMinimized}
          setIsStatsMinimized={setIsStatsMinimized}
          handleTypeClick={handleTypeClick}
          handlePopulationSelect={handlePopulationSelect}
        />
        <CityMap
          places={filteredPlaces}
          onBoundsChange={setMapBounds}
          onPlaceSelect={(place) => {
            // When a place is selected, ensure its type is included in activeTypes
            if (!filters.activeTypes.includes(place.type as any)) {
              setFilters({
                ...filters,
                activeTypes: [...filters.activeTypes, place.type as any],
              });
            }
          }}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};
