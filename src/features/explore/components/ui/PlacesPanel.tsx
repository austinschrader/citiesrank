/**
 * Panel displaying search results in grid layout
 * Uses: PlaceCardGrid for layout, CitiesContext for data
 * Location: src/features/explore/components
 */
import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { useMap } from "@/features/map/context/MapContext";
import { useSelection } from "@/features/map/context/SelectionContext";
import { PlaceCardGrid } from "@/features/places/components/ui/grids/PlaceCardGrid";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { useScrollToSelected } from "@/features/places/hooks/useScrollToSelected";
import { CitiesResponse } from "@/lib/types/pocketbase-types";

interface PlacesPanelProps {
  isLoadingMore: boolean;
  isResultsPanelCollapsed: boolean;
  paginatedFilteredPlaces: CitiesResponse[];
  onLoadMore: () => void;
  hasMore: () => boolean;
}

export const PlacesPanel = ({
  isLoadingMore,
  isResultsPanelCollapsed,
  paginatedFilteredPlaces,
  onLoadMore,
  hasMore,
}: PlacesPanelProps) => {
  const { prioritizedPlaces, splitMode } = useMap();
  const { selectedPlace, fromMap } = useSelection();
  const gridRef = useScrollToSelected(selectedPlace, fromMap);

  const observerTarget = useInfiniteScroll(onLoadMore, hasMore, isLoadingMore);

  const displayPlaces =
    splitMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;

  return (
    <BasePanel
      isCollapsed={isResultsPanelCollapsed}
      isEmpty={displayPlaces.length === 0}
      emptyState={{
        title: "No places found",
        description: "Try zooming out or add a new place",
        buttonText: "New Place",
        buttonLink: "/places/create",
      }}
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-6">
          <PlaceCardGrid ref={gridRef} places={displayPlaces} />
          <div
            ref={observerTarget}
            className="h-4"
            style={{
              visibility:
                displayPlaces.length <
                (splitMode === "list"
                  ? paginatedFilteredPlaces.length
                  : prioritizedPlaces.length)
                  ? "visible"
                  : "hidden",
            }}
          />
          {isLoadingMore && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </div>
      </div>
    </BasePanel>
  );
};
