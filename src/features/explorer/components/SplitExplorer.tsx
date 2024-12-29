import { Button } from "@/components/ui/button";
import { FiltersBar } from "@/features/explorer/components/FiltersBar";
import { useHeader } from "@/features/header/context/HeaderContext";
import { ListPreview } from "@/features/lists/components/ListPreview";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Split from "react-split";
import { ResultsPanel } from "./ResultsPanel";

const pageSizeOptions = [15, 25, 50, 100];

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, getFilteredCities } = useFilters();
  const {
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    setVisiblePlaces,
    viewMode: mapViewMode,
    visibleLists,
  } = useMap();
  const { viewMode, itemsPerPage, setItemsPerPage } = useHeader();
  const [numFilteredToShow, setNumFilteredToShow] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
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

    return getFilteredCities(cities, (city) => ({
      matchScore: 1,
      attributeMatches: {
        budget: filters.budget ? 1 : 0,
        crowds: 1,
        tripLength: 1,
        season: filters.season ? 1 : 0,
        transit: 1,
        accessibility: 1,
      },
    }));
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
    if (cities.length > 0 && mapViewMode === "map") {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities.length, mapViewMode]);

  useEffect(() => {
    setIsResultsPanelCollapsed(mapViewMode === "map");
  }, [mapViewMode]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(pageSizeOptions[0]);
    setNumFilteredToShow(pageSizeOptions[0]);
  }, [mapViewMode, setNumPrioritizedToShow]);

  // Effect to sync numFilteredToShow with itemsPerPage
  useEffect(() => {
    setNumFilteredToShow(itemsPerPage);
    setNumPrioritizedToShow(itemsPerPage);
  }, [itemsPerPage, setNumPrioritizedToShow]);

  const hasMore = useCallback(() => {
    if (mapViewMode === "list") {
      return numFilteredToShow < filteredPlaces.length;
    }
    return numPrioritizedToShow < visiblePlacesInView.length;
  }, [
    numPrioritizedToShow,
    visiblePlacesInView.length,
    numFilteredToShow,
    filteredPlaces.length,
    mapViewMode,
  ]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      if (mapViewMode === "list") {
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
    mapViewMode,
    itemsPerPage,
  ]);

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
    <div className="h-full flex flex-col">
      <FiltersBar paginatedFilteredPlaces={paginatedFilteredPlaces} />
      <div className="flex-1 overflow-hidden">
        <Split
          className="h-full flex"
          sizes={
            mapViewMode === "list"
              ? [100, 0]
              : mapViewMode === "map"
              ? [0, 100]
              : [50, 50]
          }
          minSize={300}
          gutterSize={4}
          snapOffset={0}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden",
              mapViewMode === "list"
                ? "w-full"
                : mapViewMode === "map"
                ? "w-0 invisible"
                : "w-1/2"
            )}
          >
            {viewMode === "places" ? (
              <ResultsPanel
                isLoadingMore={isLoadingMore}
                observerTarget={observerTarget}
                isResultsPanelCollapsed={false}
                setIsResultsPanelCollapsed={() => {}}
                paginatedFilteredPlaces={paginatedFilteredPlaces}
                itemsPerPage={itemsPerPage}
                onPageSizeChange={setItemsPerPage}
              />
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <div className="p-4 space-y-6">
                    {visibleLists.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-4 max-w-sm">
                          <div className="space-y-2">
                            <p className="text-gray-500">No lists found</p>
                            <p className="text-sm text-muted-foreground">
                              Try zooming out or create a list
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9 text-md font-medium"
                            asChild
                          >
                            <Link
                              to="/lists/create"
                              className="flex items-center gap-2"
                            >
                              <PlusCircle className="h-4 w-4" />
                              <span>New List</span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {visibleLists.map((list) => (
                          <ListPreview key={list.id} list={list} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            key={`map-${mapViewMode}`}
            className={cn(
              "relative transition-all duration-300 ease-in-out overflow-hidden",
              mapViewMode === "list"
                ? "w-0 invisible"
                : mapViewMode === "map"
                ? "w-full"
                : "w-1/2"
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
