/**
 * Panel displaying search results in grid layout
 * Uses: PlaceCardGrid for layout, CitiesContext for data
 * Location: src/features/explore/components
 */
import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { EmptyState } from "@/features/explore/components/ui/EmptyState";
import { useMap } from "@/features/map/context/MapContext";
import { useSelection } from "@/features/map/context/SelectionContext";
import { PlaceCardGrid } from "@/features/places/components/ui/grids/PlaceCardGrid";
import { useCities } from "@/features/places/context/CitiesContext";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { RefObject, useEffect, useRef } from "react";

interface PlacesPanelProps {
  isLoadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement>;
  isResultsPanelCollapsed: boolean;
  paginatedFilteredPlaces: CitiesResponse[];
}

export const PlacesPanel = ({
  isLoadingMore,
  observerTarget,
  isResultsPanelCollapsed,
  paginatedFilteredPlaces,
}: PlacesPanelProps) => {
  const { cities } = useCities();
  const { prioritizedPlaces, visiblePlacesInView, splitMode } = useMap();
  const { selectedPlace, fromMap } = useSelection();
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll to selected place when it changes
  useEffect(() => {
    if (selectedPlace && gridRef.current && fromMap) {
      const selectedElement = gridRef.current.querySelector(
        `[data-id="${selectedPlace.id}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedPlace, fromMap]);

  // Use different data source based on layout mode
  const displayPlaces =
    splitMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;

  return (
    <BasePanel isCollapsed={isResultsPanelCollapsed}>
      {/* Panel Content */}
      <div
        className={cn(
          "flex flex-col h-full transition-all duration-300",
          isResultsPanelCollapsed
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        )}
      >
        {/* Results Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4 space-y-6">
            {displayPlaces.length === 0 ? (
              <EmptyState
                title="No places found"
                description="Try zooming out or add a new place"
                buttonText="New Place"
                buttonLink="/places/create"
              />
            ) : (
              <>
                <PlaceCardGrid
                  ref={gridRef}
                  places={displayPlaces}
                  className={cn(
                    "transition-all duration-300",
                    isResultsPanelCollapsed ? "opacity-0" : "opacity-100"
                  )}
                />
              </>
            )}
            <div
              ref={observerTarget}
              className="h-4"
              style={{
                visibility:
                  displayPlaces.length < cities.length ? "visible" : "hidden",
              }}
            />
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePanel>
  );
};
