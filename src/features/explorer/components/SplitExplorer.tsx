import { FiltersBar } from "@/features/explorer/components/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResultsPanel } from "./ResultsPanel";

const pageSizeOptions = [15, 25, 50, 100];

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { getFilteredCities } = useFilters();
  const {
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    setVisiblePlaces,
    viewMode,
  } = useMap();
  const [numFilteredToShow, setNumFilteredToShow] = useState(
    pageSizeOptions[0]
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);

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

  // Get paginated filtered places
  const paginatedFilteredPlaces = useMemo(() => {
    return filteredPlaces.slice(0, numFilteredToShow);
  }, [filteredPlaces, numFilteredToShow]);

  // Update visible places in map context
  useEffect(() => {
    if (cities.length > 0) {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities, filteredPlaces, setVisiblePlaces]);

  // Set initial visible places
  useEffect(() => {
    if (cities.length > 0 && viewMode === "map") {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities.length, viewMode]);

  useEffect(() => {
    setIsResultsPanelCollapsed(viewMode === "map");
  }, [viewMode]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(pageSizeOptions[0]);
    setNumFilteredToShow(pageSizeOptions[0]);
  }, [viewMode, setNumPrioritizedToShow]);

  const hasMore = useCallback(() => {
    if (viewMode === "list") {
      return numFilteredToShow < filteredPlaces.length;
    }
    return numPrioritizedToShow < visiblePlacesInView.length;
  }, [
    numPrioritizedToShow,
    visiblePlacesInView.length,
    numFilteredToShow,
    filteredPlaces.length,
    viewMode,
  ]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      if (viewMode === "list") {
        setNumFilteredToShow((prev) => prev + itemsPerPage);
      } else {
        setNumPrioritizedToShow((prev) => prev + itemsPerPage);
      }
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore, setNumPrioritizedToShow, viewMode, itemsPerPage]);

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
    <div className="h-screen flex flex-col">
      <div className="flex flex-col h-full">
        <FiltersBar />
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredPlaces.length} places found
            </span>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div
            key={viewMode}
            className={cn(
              "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden",
              viewMode === "map"
                ? "w-0 invisible"
                : viewMode === "list"
                ? "w-full"
                : "w-[800px]"
            )}
          >
            <ResultsPanel
              isLoadingMore={isLoadingMore}
              observerTarget={observerTarget}
              isResultsPanelCollapsed={isResultsPanelCollapsed}
              setIsResultsPanelCollapsed={setIsResultsPanelCollapsed}
              paginatedFilteredPlaces={paginatedFilteredPlaces}
              itemsPerPage={itemsPerPage}
              onPageSizeChange={(newSize) => {
                setItemsPerPage(newSize);
                setNumFilteredToShow(newSize);
                setNumPrioritizedToShow(newSize);
              }}
            />
          </div>
          <div
            key={`map-${viewMode}`}
            className={cn(
              "relative transition-all duration-300 ease-in-out overflow-hidden",
              viewMode === "list"
                ? "w-0 invisible"
                : viewMode === "map"
                ? "w-full"
                : "flex-1"
            )}
          >
            <div
              className={cn(
                "absolute inset-0",
                viewMode === "list" && "pointer-events-none"
              )}
            >
              <CityMap className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
