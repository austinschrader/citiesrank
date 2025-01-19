import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import React from "react";

interface ResultsGridProps {
  cities: CitiesResponse[];
  isLoadingMore: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({
  cities,
  isLoadingMore,
  observerRef,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
        {cities.map((place) => {
          return (
            <PlaceCard
              key={place.id || place.name}
              city={place}
              variant="ranked"
            />
          );
        })}
      </div>

      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {isLoadingMore && (
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        )}
      </div>
    </>
  );
};
