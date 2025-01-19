/**
 * Layout component that:
 * - Manages pagination state
 * - Handles infinite scroll
 * - Renders appropriate panel based on content type
 * 
 * Data flow: MapContext -> SplitExplorer -> Panel components
 * Pure layout - no filtering/visibility logic
 */
import { useHeader } from "@/context/HeaderContext";
import { FiltersBar } from "@/features/explore/components/ui/FiltersBar";
import { ListsPanel } from "@/features/explore/components/ui/ListsPanel";
import { PlacesPanel } from "@/features/explore/components/ui/PlacesPanel";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import Split from "react-split";

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, getFilteredCities } = useFilters();
  const {
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    setVisiblePlaces,
    splitMode,
    visibleLists,
  } = useMap();
  const { contentType } = useHeader();
  const BATCH_SIZE = 25; // Fixed size for infinite scroll
  const [numFilteredToShow, setNumFilteredToShow] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

  // Memoize the active filters check
  const hasActiveFilters = useMemo(
    () =>
      filters.search ||
      filters.averageRating ||
      filters.populationCategory ||
      filters.travelStyle ||
      filters.tags.length > 0 ||
      filters.season ||
      filters.budget ||
      filters.activeTypes.length !== Object.values(CitiesTypeOptions).length,
    [filters]
  );

  // Get filtered places using FiltersContext
  const filteredPlaces = useMemo(() => {
    if (!hasActiveFilters) {
      return cities;
    }
    return getFilteredCities(cities);
  }, [cities, getFilteredCities, filters, hasActiveFilters]);

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

  useEffect(() => {
    setIsResultsPanelCollapsed(splitMode === "map");
  }, [splitMode]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(BATCH_SIZE);
    setNumFilteredToShow(BATCH_SIZE);
  }, [splitMode]);

  // Memoize the maximum number of items
  const maxItems = useMemo(() => 
    splitMode === "list" ? filteredPlaces.length : visiblePlacesInView.length
  , [splitMode, filteredPlaces.length, visiblePlacesInView.length]);

  const hasMore = useCallback(() => {
    const currentCount = splitMode === "list" ? numFilteredToShow : numPrioritizedToShow;
    return currentCount < maxItems;
  }, [splitMode, numFilteredToShow, numPrioritizedToShow, maxItems]);

  const loadMore = useCallback(async () => {
    if (!hasMore() || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      
      if (splitMode === "list") {
        setNumFilteredToShow(prev => prev + BATCH_SIZE);
      } else {
        setNumPrioritizedToShow(prev => prev + BATCH_SIZE);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, splitMode]);

  const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

  return (
    <div className="h-full flex flex-col">
      <FiltersBar paginatedFilteredPlaces={paginatedFilteredPlaces} />
      <div className="flex-1 overflow-hidden">
        <Split
          className="h-full flex"
          sizes={
            splitMode === "list"
              ? [100, 0]
              : splitMode === "map"
              ? [0, 100]
              : [50, 50]
          }
          minSize={0}
          gutterSize={4}
          snapOffset={0}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              splitMode === "list"
                ? "flex-1"
                : splitMode === "map"
                ? "w-0"
                : "flex-1",
              splitMode === "map" && "hidden"
            )}
          >
            {contentType === "places" ? (
              <PlacesPanel
                isLoadingMore={isLoadingMore}
                isResultsPanelCollapsed={false}
                paginatedFilteredPlaces={paginatedFilteredPlaces}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            ) : (
              <ListsPanel isCollapsed={false} />
            )}
          </div>

          <div
            key={`map-${splitMode}`}
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              splitMode === "list"
                ? "w-0"
                : splitMode === "map"
                ? "flex-1"
                : "flex-1",
              splitMode === "list" && "hidden"
            )}
          >
            <div className="absolute inset-0">
              <CityMap className="h-full" />
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
};
