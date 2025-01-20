import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/ui/cards/PlaceCard";
import { SearchInput } from "@/features/places/components/ui/search/SearchInput";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface SelectablePlacesPanelProps {
  onPlacesSelected?: (places: CitiesResponse[]) => void;
  batchSize?: number;
}

export const SelectablePlacesPanel = ({
  onPlacesSelected,
  batchSize = 12,
}: SelectablePlacesPanelProps) => {
  const { 
    paginatedFilteredPlaces,
    isLoadingMore,
    hasMore,
    loadMore,
    getDisplayPlaces,
    splitMode,
    setNumPrioritizedToShow
  } = useMap();
  const [selectedPlaces, setSelectedPlaces] = useState<CitiesResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Set initial batch size
  useEffect(() => {
    setNumPrioritizedToShow(batchSize);
  }, [batchSize, setNumPrioritizedToShow]);

  const displayPlaces = useMemo(() => {
    const places = getDisplayPlaces(paginatedFilteredPlaces);
    if (!searchQuery) return places;

    const query = searchQuery.toLowerCase();
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.country.toLowerCase().includes(query) ||
        place.description?.toLowerCase().includes(query)
    );
  }, [paginatedFilteredPlaces, searchQuery, getDisplayPlaces]);

  const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

  const handlePlaceClick = useCallback((place: CitiesResponse) => {
    setSelectedPlaces((prev) => {
      const isSelected = prev.some((p) => p.id === place.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== place.id);
      }
      return [...prev, place];
    });
  }, []);

  useEffect(() => {
    if (onPlacesSelected) {
      onPlacesSelected(selectedPlaces);
    }
  }, [selectedPlaces, onPlacesSelected]);

  return (
    <BasePanel
      isEmpty={displayPlaces.length === 0}
      emptyState={{
        title: "No places found",
        description: "Try zooming out or add a new place",
        buttonText: "New Place",
        buttonLink: "/places/create",
      }}
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 border-b">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search places..."
          />
        </div>
        <div className="p-4">
          <div
            className={cn(
              "grid gap-4 auto-rows-[minmax(min-content,max-content)]",
              splitMode === "list"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {displayPlaces.map((place) => {
              const isSelected = selectedPlaces.some((p) => p.id === place.id);
              return (
                <div
                  key={place.id}
                  className="relative"
                  onClick={() => handlePlaceClick(place)}
                >
                  <PlaceCard city={place} variant="basic" />
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl transition-colors",
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "hover:bg-primary/5"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {isLoadingMore && (
            <div className="grid gap-4 auto-rows-[minmax(min-content,max-content)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}
          <div ref={observerTarget} className="h-4" />
        </div>
      </div>
    </BasePanel>
  );
};
