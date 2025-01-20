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
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import Split from "react-split";

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { getFilteredCities } = useFilters();
  const {
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    setVisiblePlaces,
    splitMode,
    maxItems,
  } = useMap();
  const { contentType } = useHeader();
  const BATCH_SIZE = 25; // Fixed size for infinite scroll
  const [numFilteredToShow, setNumFilteredToShow] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get filtered places using FiltersContext
  const filteredPlaces = useMemo(() => {
    return getFilteredCities(cities);
  }, [cities, getFilteredCities]);

  // Get paginated filtered places (no need to memoize this simple slice)
  const paginatedFilteredPlaces = filteredPlaces.slice(0, numFilteredToShow);

  // Update visible places in map context
  useEffect(() => {
    if (cities.length > 0) {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities, filteredPlaces, setVisiblePlaces]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(BATCH_SIZE);
    setNumFilteredToShow(BATCH_SIZE);
  }, [splitMode]);

  const hasMore = () => {
    const currentCount =
      splitMode === "list" ? numFilteredToShow : numPrioritizedToShow;
    return currentCount < maxItems;
  };

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      if (splitMode === "list") {
        setNumFilteredToShow((prev) => prev + BATCH_SIZE);
      } else {
        setNumPrioritizedToShow((prev) => prev + BATCH_SIZE);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, splitMode]);

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
                isResultsPanelCollapsed={splitMode === "map"}
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
