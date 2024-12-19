import { FiltersBar } from "@/features/explorer/components/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  PopulationCategory,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Building2, Globe2, Landmark, MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapLegend } from "./MapLegend";
import { ResultsPanel } from "./ResultsPanel";

const citySizeEmojis: Record<PopulationCategory, string> = {
  megacity: "🌇",
  city: "🏙️",
  town: "🏰",
  village: "🏡",
};

const ITEMS_PER_PAGE = 15;

const placeTypeIcons = {
  [CitiesTypeOptions.country]: {
    icon: Globe2,
    label: "Countries",
    emoji: "🌎",
  },
  [CitiesTypeOptions.region]: { icon: MapPin, label: "Regions", emoji: "🗺️" },
  [CitiesTypeOptions.city]: { icon: Building2, label: "Cities", emoji: "🌆" },
  [CitiesTypeOptions.neighborhood]: {
    icon: Landmark,
    label: "Neighborhoods",
    emoji: "🏘️",
  },
  [CitiesTypeOptions.sight]: { icon: MapPin, label: "Sights", emoji: "🗽" },
};

const sizeTypeIcons = {
  village: { icon: Building2, label: "Villages", emoji: "🏘️" },
  town: { icon: Building2, label: "Towns", emoji: "🏰" },
  city: { icon: Building2, label: "Cities", emoji: "🌆" },
  megacity: { icon: Building2, label: "Megacities", emoji: "🌇" },
};

export type ViewMode = "list" | "split" | "map";

export const SplitExplorer = () => {
  const { cities } = useCities();
  const {
    getFilteredCities,
    filters,
    setFilters,
    handlePopulationSelect,
    handleRatingChange,
    handleTypeClick,
    resetTypeFilters,
    resetPopulationFilter,
  } = useFilters();
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

  return (
    <div className="h-screen flex flex-col">
      <FiltersBar viewMode={viewMode} setViewMode={setViewMode} />
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
