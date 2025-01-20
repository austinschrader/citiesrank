/**
 * Display component for places grid/list.
 * Pure UI - receives pre-filtered/paginated data from MapContext.
 * Paired with ListsPanel for consistent display patterns.
 */
import { BasePanel } from "@/features/explore/components/ui/BasePanel";
import { useMap } from "@/features/map/context/MapContext";
import { useSelection } from "@/features/map/context/SelectionContext";
import { PlaceCardGrid } from "@/features/places/components/ui/grids/PlaceCardGrid";
import { useInfiniteScroll } from "@/features/places/hooks/useInfiniteScroll";
import { useScrollToSelected } from "@/features/places/hooks/useScrollToSelected";

export const PlacesPanel = () => {
  const { 
    paginatedFilteredPlaces,
    isLoadingMore,
    hasMore,
    loadMore,
    getDisplayPlaces
  } = useMap();
  const { selectedPlace, fromMap } = useSelection();
  const gridRef = useScrollToSelected(selectedPlace, fromMap);

  const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoadingMore);

  const displayPlaces = getDisplayPlaces(paginatedFilteredPlaces);

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
        <PlaceCardGrid ref={gridRef} places={displayPlaces} />
        <div ref={observerTarget} />
      </div>
    </BasePanel>
  );
};
