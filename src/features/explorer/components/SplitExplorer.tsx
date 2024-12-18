import { CityMap } from "@/features/map/components/CityMap";
import { MapPlace } from "@/features/map/types";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 12;
const DEFAULT_RATING = 4.6;

export const SplitExplorer = () => {
  const { cities } = useCities();
  const { filters, setFilters } = useFilters();
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<MapPlace[]>([]);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Use all place types by default
  const [activeTypes, setActiveTypes] = useState<CitiesTypeOptions[]>(
    Object.values(CitiesTypeOptions)
  );

  // Filter places based on active types and rating
  const filteredPlaces = useMemo(() => {
    return cities.filter((place) => {
      const typeMatch = activeTypes.includes(place.type as CitiesTypeOptions);
      const ratingMatch = !filters.averageRating || (place.averageRating && place.averageRating >= filters.averageRating);
      return typeMatch && ratingMatch;
    });
  }, [cities, activeTypes, filters.averageRating]);

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
    const newTypes = new Set(activeTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setActiveTypes(Array.from(newTypes));
    setPage(1);
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel */}
      <div className="w-[500px] h-full flex flex-col border-r">
        {/* Filter Tags */}
        <div className="p-4 border-b bg-card">
          <h2 className="text-lg font-semibold mb-3 text-card-foreground">Discover Places</h2>
          
          {/* Place Types */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Place Types
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.values(CitiesTypeOptions).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium",
                    "transition-colors duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    activeTypes.includes(type)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Place Rating
            </div>
            <div className="flex items-baseline gap-2">
              <Input
                id="rating-filter"
                type="number"
                placeholder="4.6"
                value={filters.averageRating ?? ""}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="w-16 h-8 text-right"
                min="0"
                max="5"
                step="0.1"
              />
              <span className="text-xs text-muted-foreground">
                minimum rating out of 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {paginatedPlaces.map((place) => (
              <div
                key={place.id}
                className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <PlaceCard city={place} variant="compact" />
              </div>
            ))}
          </div>
          {/* Load more trigger */}
          <div ref={observerTarget} className="h-10" />
          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 h-full">
        <CityMap
          places={filteredPlaces}
          onPlaceSelect={handlePlaceSelect}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};
