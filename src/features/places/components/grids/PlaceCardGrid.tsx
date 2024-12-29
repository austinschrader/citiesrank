/**
 * Grid layout for displaying place cards in both list and map views
 * Used by: ResultsPanel
 * Location: src/features/places/components/grids
 */
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "../cards/PlaceCard";

interface PlaceCardGridProps {
  places: CitiesResponse[];
  className?: string;
}

export const PlaceCardGrid = ({
  places,
  className,
}: PlaceCardGridProps) => {
  const { viewMode } = useMap();

  return (
    <div
      className={cn(
        "grid gap-4 auto-rows-[minmax(min-content,max-content)]",
        viewMode === "list"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2",
        className
      )}
    >
      {places.map((place) => (
        <div key={place.id} className="group relative">
          <PlaceCard city={place} variant="basic" />
        </div>
      ))}
    </div>
  );
};
