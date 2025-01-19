import { useHeader } from "@/context/HeaderContext";
import { FiltersBar } from "@/features/explore/components/ui/FiltersBar";
import { ListsPanel } from "@/features/explore/components/ui/ListsPanel";
import { PlacesPanel } from "@/features/explore/components/ui/PlacesPanel";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Split from "react-split";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";

const pageSizeOptions = [15, 25, 50, 100];

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
  const { contentType, itemsPerPage, setItemsPerPage } = useHeader();
  const [numFilteredToShow, setNumFilteredToShow] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

  // Get filtered places using FiltersContext
  const filteredPlaces = useMemo(() => {
    // Only apply filters if there are active filters
    const hasActiveFilters =
      filters.search ||
      filters.averageRating ||
      filters.populationCategory ||
      filters.travelStyle ||
      filters.tags.length > 0 ||
      filters.season ||
      filters.budget ||
      filters.activeTypes.length !== Object.values(CitiesTypeOptions).length;

    if (!hasActiveFilters) {
      return cities;
    }

    return getFilteredCities(cities);
  }, [cities, getFilteredCities, filters]);

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
    if (cities.length > 0 && splitMode === "map") {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities.length, splitMode]);

  useEffect(() => {
    setIsResultsPanelCollapsed(splitMode === "map");
  }, [splitMode]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(pageSizeOptions[0]);
    setNumFilteredToShow(pageSizeOptions[0]);
  }, [splitMode, setNumPrioritizedToShow]);

  // Effect to sync numFilteredToShow with itemsPerPage
  useEffect(() => {
    setNumFilteredToShow(itemsPerPage);
    setNumPrioritizedToShow(itemsPerPage);
  }, [itemsPerPage, setNumPrioritizedToShow]);

  const hasMore = useCallback(() => {
    if (splitMode === "list") {
      return numFilteredToShow < filteredPlaces.length;
    }
    // For gallery view, check against filtered places instead of visible places
    return numPrioritizedToShow < filteredPlaces.length;
  }, [
    numPrioritizedToShow,
    filteredPlaces.length,
    numFilteredToShow,
    splitMode,
  ]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      if (splitMode === "list") {
        setNumFilteredToShow((prev) => prev + itemsPerPage);
      } else {
        setNumPrioritizedToShow((prev) => prev + itemsPerPage);
      }
      setIsLoadingMore(false);
    }, 500);
  }, [
    hasMore,
    isLoadingMore,
    setNumPrioritizedToShow,
    splitMode,
    itemsPerPage,
    numPrioritizedToShow,
  ]);

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
                observerTarget={observerTarget}
                isResultsPanelCollapsed={false}
                paginatedFilteredPlaces={paginatedFilteredPlaces}
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
