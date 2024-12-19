import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLegend } from "./MapLegend";
import { ResultsPanel } from "./ResultsPanel";

const ITEMS_PER_PAGE = 15;
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
  const { visiblePlacesInView, numPrioritizedToShow, setNumPrioritizedToShow } =
    useMap();
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
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

  // Get paginated places from prioritized places
  const paginatedPlaces = useMemo(() => {
    return visiblePlacesInView.slice(0, numPrioritizedToShow);
  }, [visiblePlacesInView, numPrioritizedToShow]);

  const hasMore = useCallback(() => {
    return numPrioritizedToShow < visiblePlacesInView.length;
  }, [numPrioritizedToShow, visiblePlacesInView.length]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setNumPrioritizedToShow((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore, setNumPrioritizedToShow, ITEMS_PER_PAGE]);

  const handleRatingChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value);
      if (!value) {
        setFilters({ ...filters, averageRating: null });
      } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
        setFilters({ ...filters, averageRating: numValue });
      }
    },
    [filters, setFilters]
  );

  // Set default rating on mount
  useEffect(() => {
    if (filters.averageRating === null) {
      setFilters({ ...filters, averageRating: DEFAULT_RATING });
    }
  }, [filters, setFilters]);

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
        filteredPlaces={visiblePlacesInView}
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
          isStatsMinimized={isStatsMinimized}
          setIsStatsMinimized={setIsStatsMinimized}
        />
        <CityMap
          places={filteredPlaces}
          onBoundsChange={setMapBounds}
          onPlaceSelect={(place) => {
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
