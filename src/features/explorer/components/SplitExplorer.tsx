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

  // Filter places based on active types, rating, and population
  const filteredPlaces = useMemo(() => {
    return cities.filter((place) => {
      const typeMatch = activeTypes.includes(place.type as CitiesTypeOptions);
      const ratingMatch = !filters.averageRating || (place.averageRating && place.averageRating >= filters.averageRating);
      const populationMatch = !filters.populationCategory || isInPopulationRange(place.population, filters.populationCategory);
      
      return typeMatch && ratingMatch && populationMatch;
    });
  }, [cities, activeTypes, filters.averageRating, filters.populationCategory]);

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

  // Colors from centralized config
  const typeColors = markerColors;

  return (
    <div className="h-screen flex">
      <div className="w-[500px] flex flex-col border-r">
        <div className="shrink-0 p-4 border-b bg-card space-y-4">
          <h2 className="text-lg font-semibold">Discover Places</h2>
          
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Place Types</div>
            <div className="flex flex-wrap gap-2">
              {Object.values(CitiesTypeOptions).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    activeTypes.includes(type)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">Place Rating</div>
            <div className="flex items-baseline gap-2">
              <Input
                type="number"
                value={filters.averageRating ?? ""}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="w-16 h-8 text-right"
                min="0" max="5" step="0.1"
              />
              <span className="text-xs text-muted-foreground">minimum rating out of 5.0</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">City Size</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePopulationSelect(
                  filters.populationCategory === "village" ? null : "village" as PopulationCategory
                )}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  filters.populationCategory === "village"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="village">🏘️</span>
                  <span>Village</span>
                </span>
              </button>
              <button
                onClick={() => handlePopulationSelect(
                  filters.populationCategory === "town" ? null : "town" as PopulationCategory
                )}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  filters.populationCategory === "town"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="town">🏰</span>
                  <span>Town</span>
                </span>
              </button>
              <button
                onClick={() => handlePopulationSelect(
                  filters.populationCategory === "city" ? null : "city" as PopulationCategory
                )}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  filters.populationCategory === "city"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="city">🌆</span>
                  <span>City</span>
                </span>
              </button>
              <button
                onClick={() => handlePopulationSelect(
                  filters.populationCategory === "megacity" ? null : "megacity" as PopulationCategory
                )}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  filters.populationCategory === "megacity"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <span role="img" aria-label="megacity">🌇</span>
                  <span>Megacity</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grow overflow-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {paginatedPlaces.map((place) => (
              <PlaceCard key={place.id} city={place} variant="compact" />
            ))}
          </div>
          <div ref={observerTarget} className="h-10" />
          {isLoadingMore && (
            <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto my-4" />
          )}
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
              {Object.entries(typeCounts).map(([type, count]) => count > 0 && (
                <div 
                  key={type}
                  style={{ 
                    '--marker-color': typeColors[type as keyof typeof typeColors]
                  } as React.CSSProperties}
                  className="px-5 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: 'var(--marker-color)',
                      boxShadow: '0 0 0 2px var(--marker-color)'
                    }} />
                    <span className="text-sm font-medium capitalize" style={{ 
                      color: 'var(--marker-color)'
                    }}>
                      {type}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ 
                      color: 'var(--marker-color)'
                    }}>
                      {count.toLocaleString()}
                    </span>
                    {mapBounds && typeCountsInView[type as CitiesTypeOptions] !== count && (
                      <span className="text-xs" style={{ 
                        color: 'var(--marker-color)',
                        opacity: 0.8
                      }}>
                        ({typeCountsInView[type as CitiesTypeOptions]} in view)
                      </span>
                    )}
                  </div>
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
