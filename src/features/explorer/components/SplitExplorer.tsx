import { CityMap } from "@/features/map/components/CityMap";
import { MapPlace } from "@/features/map/types";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters, isInPopulationRange, PopulationCategory } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;
const DEFAULT_RATING = 4.6;

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, setFilters } = useFilters();
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<MapPlace[]>([]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Use all place types by default
  const [activeTypes, setActiveTypes] = useState<CitiesTypeOptions[]>(
    Object.values(CitiesTypeOptions)
  );

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.averageRating) count++;
    if (filters.populationCategory) count++;
    return count;
  }, [filters]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      averageRating: null,
      populationCategory: null
    });
  }, [setFilters]);

  // Filter places based on active types, rating, population, and search
  const filteredPlaces = useMemo(() => {
    return cities.filter((place) => {
      const typeMatch = activeTypes.includes(place.type as CitiesTypeOptions);
      const ratingMatch = !filters.averageRating || (place.averageRating && place.averageRating >= filters.averageRating);
      const populationMatch = !filters.populationCategory || isInPopulationRange(place.population, filters.populationCategory);
      const searchMatch = !filters.search || 
        place.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        place.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        place.type?.toLowerCase().includes(filters.search.toLowerCase());
      
      return typeMatch && ratingMatch && populationMatch && searchMatch;
    });
  }, [cities, activeTypes, filters.averageRating, filters.populationCategory, filters.search]);

  // Calculate counts by type
  const typeCounts = useMemo(() => {
    const counts: Record<CitiesTypeOptions, number> = {
      [CitiesTypeOptions.country]: 0,
      [CitiesTypeOptions.region]: 0,
      [CitiesTypeOptions.city]: 0,
      [CitiesTypeOptions.neighborhood]: 0,
      [CitiesTypeOptions.sight]: 0,
    };
    
    filteredPlaces.forEach((place) => {
      if (place.type) {
        counts[place.type as CitiesTypeOptions]++;
      }
    });
    
    return counts;
  }, [filteredPlaces]);

  // Calculate places in current view
  const placesInView = useMemo(() => {
    if (!mapBounds) return filteredPlaces;
    
    return filteredPlaces.filter(place => {
      if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') return false;
      return mapBounds.contains([place.latitude, place.longitude]);
    });
  }, [filteredPlaces, mapBounds]);

  // Calculate type counts for places in view
  const typeCountsInView = useMemo(() => {
    const counts: Record<CitiesTypeOptions, number> = {
      [CitiesTypeOptions.country]: 0,
      [CitiesTypeOptions.region]: 0,
      [CitiesTypeOptions.city]: 0,
      [CitiesTypeOptions.neighborhood]: 0,
      [CitiesTypeOptions.sight]: 0,
    };
    
    placesInView.forEach((place) => {
      if (place.type) {
        counts[place.type as CitiesTypeOptions]++;
      }
    });
    
    return counts;
  }, [placesInView]);

  // Debug log
  useEffect(() => {
    console.log('Total cities:', cities.length);
    console.log('Filtered places:', filteredPlaces.length);
    console.log('Type counts:', typeCounts);
  }, [cities.length, filteredPlaces.length, typeCounts]);

  // Get paginated places
  const paginatedPlaces = useMemo(() => {
    return filteredPlaces.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredPlaces, page]);

  const hasMore = useCallback(() => {
    return paginatedPlaces.length < filteredPlaces.length;
  }, [paginatedPlaces.length, filteredPlaces.length]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    // Simulate loading delay for smoother UX
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore]);

  const handleTypeClick = (type: CitiesTypeOptions) => {
    // Clear population filter if selecting a non-city type
    if (type !== CitiesTypeOptions.city && filters.populationCategory) {
      setFilters({ populationCategory: null });
    }

    // Toggle the type in activeTypes
    setActiveTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      
      // If all types are removed, restore all types
      return newTypes.length === 0 ? Object.values(CitiesTypeOptions) : newTypes;
    });
  };

  const handleRatingChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!value) {
      setFilters({ averageRating: null });
    } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFilters({ averageRating: numValue });
    }
  };

  const handlePlaceSelect = (place: MapPlace) => {
    setSelectedPlace(place);
  };

  const handlePopulationSelect = (category: PopulationCategory | null) => {
    if (category) {
      // When selecting a population category, only show cities
      setActiveTypes([CitiesTypeOptions.city]);
      setFilters({ populationCategory: category });
    } else {
      // When deselecting, keep only currently active types
      setFilters({ populationCategory: null });
    }
  };

  // Set default rating on mount
  useEffect(() => {
    if (filters.averageRating === null) {
      setFilters({ averageRating: DEFAULT_RATING });
    }
  }, []);

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

  const [isStatsMinimized, setIsStatsMinimized] = useState(false);
  const [isCitySizesExpanded, setIsCitySizesExpanded] = useState(false);
  const [isResultsPanelCollapsed, setIsResultsPanelCollapsed] = useState(false);

  // Colors from centralized config
  const typeColors = markerColors;
  
  const typeEmojis: Record<CitiesTypeOptions, string> = {
    [CitiesTypeOptions.country]: '🌎',
    [CitiesTypeOptions.region]: '🗺️',
    [CitiesTypeOptions.city]: '🌆',
    [CitiesTypeOptions.neighborhood]: '🏘️',
    [CitiesTypeOptions.sight]: '🎯'
  };

  const citySizeEmojis: Record<PopulationCategory, string> = {
    megacity: '🌇',
    city: '🏙️',
    town: '🏰',
    village: '🏡'
  };

  return (
    <div className="h-screen flex">
      {/* Results Panel */}
      <div className={cn(
        "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out relative",
        isResultsPanelCollapsed ? "w-0" : "w-[500px]"
      )}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsResultsPanelCollapsed(!isResultsPanelCollapsed)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-10",
            "h-24 w-6 bg-background/80 backdrop-blur-sm",
            "border border-border shadow-lg",
            isResultsPanelCollapsed ? "rounded-r-lg -right-6" : "rounded-r-lg right-0 border-l-0",
            "flex items-center justify-center",
            "hover:bg-accent/50 transition-colors group"
          )}
          aria-label={isResultsPanelCollapsed ? "Expand results panel" : "Collapse results panel"}
        >
          {isResultsPanelCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>

        {/* Panel Content */}
        <div className={cn(
          "flex flex-col h-full transition-all duration-300",
          isResultsPanelCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {/* Header Section */}
          <div className="shrink-0 p-4 border-b bg-background/50 backdrop-blur-sm">
            {/* Title and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Discover Places</h2>
                <div className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {filteredPlaces.length}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  className={cn(
                    "h-6 px-3 text-xs relative group",
                    "bg-foreground text-background hover:bg-foreground/90",
                    "transition-all duration-200"
                  )}
                  onClick={clearAllFilters}
                >
                  <span className="relative pr-4">
                    Filters({activeFilterCount})
                    <span className={cn(
                      "absolute right-[-4px] top-1/2 -translate-y-1/2",
                      "text-lg leading-none opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-200 font-medium"
                    )}>
                      ×
                    </span>
                  </span>
                  <div className="absolute invisible group-hover:visible bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md -bottom-20 left-0 w-48 text-xs z-50">
                    <div className="space-y-1">
                      {filters.search && <div>Search: "{filters.search}"</div>}
                      {filters.averageRating && <div>Rating: ≥{filters.averageRating}</div>}
                      {filters.populationCategory && <div>Size: {filters.populationCategory}</div>}
                    </div>
                  </div>
                </Button>
              )}
            </div>

            {/* Filters Section */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search places..."
                  className="w-full pl-9"
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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

              {/* Rating and Size Filters */}
              <div className="grid grid-cols-2 gap-4">
                {/* Rating Filter */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Minimum Rating</span>
                  <div className="inline-flex items-center gap-1 bg-muted/50 rounded-md px-2">
                    <Star className="h-3.5 w-3.5 text-muted-foreground fill-muted-foreground" />
                    <Input
                      type="number"
                      value={filters.averageRating ?? ""}
                      onChange={(e) => handleRatingChange(e.target.value)}
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
                <div className="space-y-2">
                  <span className="text-sm font-medium">City Size</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries({
                      village: { emoji: "🏘️", label: "Village" },
                      town: { emoji: "🏰", label: "Town" },
                      city: { emoji: "🌆", label: "City" },
                      megacity: { emoji: "🌇", label: "Megacity" }
                    }).map(([size, { emoji, label }]) => (
                      <button
                        key={size}
                        onClick={() => handlePopulationSelect(
                          filters.populationCategory === size ? null : size as PopulationCategory
                        )}
                        className={cn(
                          "px-2 py-1 rounded-md text-sm font-medium",
                          "transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          filters.populationCategory === size
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-all duration-200",
                              filters.populationCategory === size
                                ? "opacity-100 scale-125"
                                : "opacity-40"
                            )}
                            style={{ 
                              backgroundColor: typeColors[CitiesTypeOptions.city]
                            }}
                          />
                          <span className="text-base" role="img" aria-label={`${size} emoji`}>
                            {citySizeEmojis[size as PopulationCategory]}
                          </span>
                          <span className="capitalize">{size}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grow overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
            <div className="p-4 space-y-6">
              {/* Results count */}
              <div className="flex items-center justify-between text-sm px-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Showing</span>
                  <span className="font-medium">{paginatedPlaces.length}</span>
                  <span className="text-muted-foreground">of</span>
                  <span className="font-medium">{filteredPlaces.length}</span>
                  <span className="text-muted-foreground">places</span>
                </div>
                {isLoadingMore && (
                  <span className="text-xs text-muted-foreground animate-pulse">Loading more...</span>
                )}
              </div>

              {/* Active Filters */}
              {(filters.averageRating || filters.populationCategory || filters.search || activeTypes.length !== Object.values(CitiesTypeOptions).length) && (
                <div className="flex flex-wrap gap-2">
                  {filters.averageRating && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary gap-1">
                      <Star className="w-3 h-3" />
                      {filters.averageRating}+
                    </span>
                  )}
                  {filters.populationCategory && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {citySizeEmojis[filters.populationCategory]}
                      <span className="ml-1 capitalize">{filters.populationCategory}</span>
                    </span>
                  )}
                  {filters.search && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      "{filters.search}"
                    </span>
                  )}
                  {activeTypes.length !== Object.values(CitiesTypeOptions).length && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {activeTypes.length} types
                    </span>
                  )}
                </div>
              )}

              {/* Grid of cards */}
              <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(min-content,max-content)]">
                {paginatedPlaces.map((place) => (
                  <PlaceCard key={place.id} city={place} variant="compact" />
                ))}
              </div>

              {/* Loading indicator */}
              <div 
                ref={observerTarget} 
                className={cn(
                  "h-16 flex items-center justify-center transition-opacity duration-200",
                  isLoadingMore ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grow relative">
        <div className="absolute left-4 top-4 z-10">
          <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 w-[280px]">
            {/* Header with total count */}
            <div className="px-5 py-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">
                      {filteredPlaces.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {filteredPlaces.length === 1 ? 'place' : 'places'}
                    </span>
                  </div>
                  {mapBounds && placesInView.length !== filteredPlaces.length && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {placesInView.length} in current view
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsStatsMinimized(!isStatsMinimized)}
                  className="p-1 hover:bg-accent rounded-full transition-colors"
                >
                  {isStatsMinimized ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              
              {/* Active Filters Summary */}
              <div className={cn(
                "flex gap-2 mt-2 flex-wrap transition-all duration-150 overflow-hidden",
                isStatsMinimized ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
              )}>
                {filters.averageRating && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Star className="w-3 h-3 mr-1" />
                    {filters.averageRating}+
                  </span>
                )}
                {filters.populationCategory && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {filters.populationCategory.charAt(0).toUpperCase() + filters.populationCategory.slice(1)}
                  </span>
                )}
                {activeTypes.length !== Object.values(CitiesTypeOptions).length && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {activeTypes.length} types
                  </span>
                )}
              </div>
            </div>
            
            {/* Type breakdown */}
            <div className={cn(
              "transition-all duration-150 divide-y divide-border/50 overflow-hidden",
              isStatsMinimized ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
            )}>
              {Object.values(CitiesTypeOptions).map((type) => (
                <div key={type}>
                  <button 
                    onClick={() => handleTypeClick(type)}
                    style={{ 
                      '--marker-color': typeColors[type as keyof typeof typeColors],
                      backgroundColor: activeTypes.includes(type) 
                        ? `${typeColors[type as keyof typeof typeColors]}15`
                        : undefined
                    } as React.CSSProperties}
                    className={cn(
                      "w-full px-5 py-3 flex items-center justify-between",
                      "transition-all duration-200 ease-in-out",
                      activeTypes.includes(type) 
                        ? "hover:brightness-110" 
                        : "hover:bg-accent/10",
                      "cursor-pointer"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        activeTypes.includes(type)
                          ? "scale-125"
                          : "opacity-40"
                      )} style={{ 
                        backgroundColor: 'var(--marker-color)',
                        boxShadow: activeTypes.includes(type)
                          ? '0 0 8px var(--marker-color)'
                          : 'none'
                      }} />
                      <span className="text-lg mr-1" role="img" aria-label={`${type} emoji`}>
                        {typeEmojis[type]}
                      </span>
                      <span className={cn(
                        "text-sm font-medium capitalize transition-all duration-200",
                      )} style={{
                        color: activeTypes.includes(type)
                          ? 'var(--marker-color)'
                          : 'var(--muted-foreground)'
                      }}>
                        {type}s
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm transition-all duration-200",
                        activeTypes.includes(type)
                          ? "font-semibold"
                          : "font-medium text-muted-foreground"
                      )} style={{
                        color: activeTypes.includes(type)
                          ? 'var(--marker-color)'
                          : undefined
                      }}>
                        {typeCounts[type].toLocaleString()}
                      </span>
                      {mapBounds && typeCountsInView[type] !== typeCounts[type] && (
                        <span className={cn(
                          "text-xs transition-all duration-200",
                          activeTypes.includes(type)
                            ? "opacity-80"
                            : "opacity-40"
                        )} style={{
                          color: activeTypes.includes(type)
                            ? 'var(--marker-color)'
                            : undefined
                        }}>
                          ({typeCountsInView[type]} in view)
                        </span>
                      )}
                      {type === CitiesTypeOptions.city && activeTypes.includes(type) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCitySizesExpanded(!isCitySizesExpanded);
                          }}
                          className="p-1 hover:bg-accent/50 rounded-full"
                        >
                          <ChevronUp
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              !isCitySizesExpanded && "rotate-180"
                            )}
                            style={{
                              color: activeTypes.includes(type)
                                ? 'var(--marker-color)'
                                : 'var(--muted-foreground)'
                            }}
                          />
                        </button>
                      )}
                    </div>
                  </button>
                  
                  {/* Nested City Size Filters */}
                  {type === CitiesTypeOptions.city && activeTypes.includes(CitiesTypeOptions.city) && (
                    <div className={cn(
                      "divide-y divide-border/50 overflow-hidden transition-all duration-200",
                      isCitySizesExpanded 
                        ? "max-h-[200px] opacity-100" 
                        : "max-h-0 opacity-0"
                    )}>
                      {(['megacity', 'city', 'town', 'village'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handlePopulationSelect(size as PopulationCategory)}
                          className={cn(
                            "w-full px-5 py-2 flex items-center justify-between",
                            "transition-all duration-200 ease-in-out text-sm",
                            "pl-7",
                            filters.populationCategory === size
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                                filters.populationCategory === size
                                  ? "opacity-100 scale-125"
                                  : "opacity-40"
                              )}
                              style={{ 
                                backgroundColor: typeColors[CitiesTypeOptions.city]
                              }}
                            />
                            <span className="text-base" role="img" aria-label={`${size} emoji`}>
                              {citySizeEmojis[size as PopulationCategory]}
                            </span>
                            <span className="capitalize">{size}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <CityMap
          places={filteredPlaces}
          onPlaceSelect={handlePlaceSelect}
          className="h-full w-full"
          onBoundsChange={setMapBounds}
        />
      </div>
    </div>
  );
};
