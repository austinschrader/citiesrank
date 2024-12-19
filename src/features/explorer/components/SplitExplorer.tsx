import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLegend } from "./MapLegend";
import { ResultsPanel } from "./ResultsPanel";

const ITEMS_PER_PAGE = 15;

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, setFilters, getFilteredCities } = useFilters();
  const { visiblePlacesInView, numPrioritizedToShow, setNumPrioritizedToShow, setVisiblePlaces } = useMap();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

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

  // Update visible places in map context
  useEffect(() => {
    setVisiblePlaces(filteredPlaces);
  }, [filteredPlaces, setVisiblePlaces]);

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
  }, [hasMore, isLoadingMore, setNumPrioritizedToShow]);

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
        paginatedPlaces={paginatedPlaces}
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
        <CityMap className="h-full" />
      </div>
    </div>
  );
};
