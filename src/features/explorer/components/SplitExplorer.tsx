import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { LayoutGrid, Map, SplitSquareHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLegend } from "./MapLegend";
import { ResultsPanel } from "./ResultsPanel";

const ITEMS_PER_PAGE = 15;

export type ViewMode = "list" | "split" | "map";

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { getFilteredCities } = useFilters();
  const {
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    setVisiblePlaces,
  } = useMap();
  const [numFilteredToShow, setNumFilteredToShow] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

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
    setVisiblePlaces(filteredPlaces);
  }, [filteredPlaces, setVisiblePlaces]);

  useEffect(() => {
    setIsResultsPanelCollapsed(viewMode === "map");
  }, [viewMode]);

  // Reset pagination when view changes
  useEffect(() => {
    setNumPrioritizedToShow(ITEMS_PER_PAGE);
    setNumFilteredToShow(ITEMS_PER_PAGE);
  }, [viewMode, setNumPrioritizedToShow]);

  const hasMore = useCallback(() => {
    if (viewMode === "list") {
      return numFilteredToShow < filteredPlaces.length;
    }
    return numPrioritizedToShow < visiblePlacesInView.length;
  }, [numPrioritizedToShow, visiblePlacesInView.length, numFilteredToShow, filteredPlaces.length, viewMode]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      if (viewMode === "list") {
        setNumFilteredToShow((prev) => prev + ITEMS_PER_PAGE);
      } else {
        setNumPrioritizedToShow((prev) => prev + ITEMS_PER_PAGE);
      }
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore, setNumPrioritizedToShow, viewMode]);

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

  const ViewModeToggle = () => (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg p-1 bg-muted">
            {[
              { mode: "list" as const, icon: LayoutGrid, label: "List view" },
              {
                mode: "split" as const,
                icon: SplitSquareHorizontal,
                label: "Split view",
              },
              { mode: "map" as const, icon: Map, label: "Map view" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                  "text-sm font-medium",
                  viewMode === mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{mode}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <ViewModeToggle />
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
            viewMode={viewMode}
            paginatedFilteredPlaces={paginatedFilteredPlaces}
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
            <MapLegend
              isStatsMinimized={isStatsMinimized}
              setIsStatsMinimized={setIsStatsMinimized}
            />
            <CityMap className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
