import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ActiveFilters } from "@/features/explorer/components/filters/ActiveFilters";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  PopulationCategory,
  SortOrder,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  Building2,
  Globe2,
  Landmark,
  LayoutGrid,
  Map,
  MapPin,
  SplitSquareHorizontal,
  Star,
} from "lucide-react";
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
      {/* Global Filters Section */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container max-w-[1600px] mx-auto py-4">
          <div className="flex flex-col gap-4">
            {/* Top Row - Search and View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Beautiful Title */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium text-muted-foreground">
                    Discover
                  </h2>
                  <h1 className="text-3xl font-semibold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                    World's Top Destinations
                  </h1>
                </div>
                {/* Search */}
                <div className="relative w-[400px]">
                  <Input
                    type="text"
                    placeholder="Search cities, regions, or landmarks..."
                    className="w-full pl-9"
                    value={filters.search || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Control */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Sort by
                  </span>
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sort: e.target.value as SortOrder,
                      })
                    }
                    className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="match">Best Match</option>
                    <option value="popular">Most Popular</option>
                    <option value="alphabetical-asc">Name A to Z</option>
                    <option value="alphabetical-desc">Name Z to A</option>
                    <option value="cost-low">Cost: Low to High</option>
                    <option value="cost-high">Cost: High to Low</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border-l pl-4">
                  {[
                    {
                      mode: "list" as const,
                      icon: LayoutGrid,
                      label: "List view",
                    },
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
                        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                        viewMode === mode
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize hidden sm:inline">
                        {mode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-6">
              {/* Place Type Filter */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        filters.activeTypes.length > 0 ? "default" : "outline"
                      }
                      className={cn(
                        "h-9 gap-2 w-[140px]",
                        filters.activeTypes.length > 0 && "font-medium"
                      )}
                    >
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-[90px] block">
                        {filters.activeTypes.length > 0
                          ? filters.activeTypes
                              .map((type) => placeTypeIcons[type].label)
                              .join(", ")
                          : "Place Type"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[320px] p-2">
                    <div className="space-y-3">
                      <div className="px-2">
                        <h4 className="font-medium leading-none text-muted-foreground">
                          Discover Places By Type
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          From countries and regions to local neighborhoods
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(placeTypeIcons).map(
                          ([type, { icon: Icon, label, emoji }]) => (
                            <button
                              key={type}
                              onClick={() =>
                                handleTypeClick(type as CitiesTypeOptions)
                              }
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                                "hover:bg-accent hover:text-accent-foreground",
                                filters.activeTypes.includes(
                                  type as CitiesTypeOptions
                                )
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-accent/50"
                              )}
                            >
                              <span
                                className="text-xl"
                                role="img"
                                aria-label={label}
                              >
                                {emoji}
                              </span>
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Rating
                </span>
                <div className="inline-flex items-center gap-1 bg-muted/50 rounded-md px-2">
                  <Star className="h-3.5 w-3.5 text-muted-foreground fill-muted-foreground" />
                  <Input
                    type="number"
                    value={filters.averageRating ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      if (!value) {
                        handleRatingChange(null);
                      } else if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 5
                      ) {
                        handleRatingChange(numValue);
                      }
                    }}
                    className="w-12 h-7 text-center bg-transparent border-0 p-0 focus-visible:ring-0"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                  />
                  <span className="text-xs text-muted-foreground">/5</span>
                </div>
              </div>

              {/* City Size Filter */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        filters.populationCategory ? "default" : "outline"
                      }
                      className={cn(
                        "h-9 gap-2 w-[140px]",
                        filters.populationCategory && "font-medium"
                      )}
                    >
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-[90px] block">
                        {filters.populationCategory
                          ? sizeTypeIcons[filters.populationCategory].label
                          : "City Size"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[320px] p-2">
                    <div className="space-y-3">
                      <div className="px-2">
                        <h4 className="font-medium leading-none text-muted-foreground">
                          Filter Cities by Population Size
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          From small villages to bustling megacities
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(sizeTypeIcons).map(
                          ([size, { icon: Icon, label, emoji }]) => (
                            <button
                              key={size}
                              onClick={() =>
                                handlePopulationSelect(
                                  filters.populationCategory === size
                                    ? null
                                    : (size as PopulationCategory)
                                )
                              }
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                                "hover:bg-accent hover:text-accent-foreground",
                                filters.populationCategory === size
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card hover:bg-accent/50"
                              )}
                            >
                              <span
                                className="text-xl"
                                role="img"
                                aria-label={label}
                              >
                                {emoji}
                              </span>
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Active Filters */}
              <div className="flex-1">
                <ActiveFilters />
              </div>
            </div>
          </div>
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
