import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/ui/cards/PlaceCard";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SelectablePlacesPanelProps {
  onPlacesSelected?: (places: CitiesResponse[]) => void;
}

export const SelectablePlacesPanel = ({
  onPlacesSelected,
}: SelectablePlacesPanelProps) => {
  const { 
    paginatedFilteredPlaces,
    isLoadingMore,
    hasMore,
    loadMore,
    getDisplayPlaces,
    splitMode
  } = useMap();
  const [selectedPlaces, setSelectedPlaces] = useState<CitiesResponse[]>([]);

  const displayPlaces = getDisplayPlaces(paginatedFilteredPlaces);
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
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
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
                <PlaceCard city={place} />
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
        <div ref={observerTarget} className="h-4" />
      </div>
    </BasePanel>
  );
};
