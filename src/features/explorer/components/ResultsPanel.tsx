/**
 * Panel displaying search results in grid layout
 * Uses: PlaceCardGrid for layout, CitiesContext for data
 * Location: src/features/explorer/components
 */
import { Button } from "@/components/ui/button";
import { useMap } from "@/features/map/context/MapContext";
import { useSelection } from "@/features/map/context/SelectionContext";
import { PlaceCardGrid } from "@/features/places/components/grids/PlaceCardGrid";
import { useCities } from "@/features/places/context/CitiesContext";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { RefObject, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface ResultsPanelProps {
  isLoadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement>;
  isResultsPanelCollapsed: boolean;
  setIsResultsPanelCollapsed: (value: boolean) => void;
  paginatedFilteredPlaces: any[]; // TODO: Add proper type
  itemsPerPage: number;
  onPageSizeChange: (size: number) => void;
}

export const ResultsPanel = ({
  isLoadingMore,
  observerTarget,
  isResultsPanelCollapsed,
  paginatedFilteredPlaces,
}: ResultsPanelProps) => {
  const { cities } = useCities();
  const { prioritizedPlaces, visiblePlacesInView, viewMode } = useMap();
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

  // Use different data source based on view mode
  const displayPlaces =
    viewMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;

  // Get the correct total count based on view mode
  const totalPlaces =
    viewMode === "list"
      ? paginatedFilteredPlaces.length
      : visiblePlacesInView.length;
  const placesInView =
    viewMode === "list" ? totalPlaces : visiblePlacesInView.length;

  return (
    <div className="h-full flex">
      <div
        className={cn(
          "flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out w-full",
          isResultsPanelCollapsed ? "w-0" : "w-full"
        )}
      >
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
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="space-y-2">
                      <p className="text-gray-500">No places found</p>
                      <p className="text-sm text-muted-foreground">
                        Try zooming out or add a new place
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 h-9"
                      asChild
                    >
                      <Link
                        to="/places/create"
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span>New Place</span>
                      </Link>
                    </Button>
                  </div>
                </div>
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
                  <div
                    ref={observerTarget}
                    className="h-4"
                    style={{
                      visibility:
                        displayPlaces.length < cities.length
                          ? "visible"
                          : "hidden",
                    }}
                  />
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
