import { Button } from "@/components/ui/button";
import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { RefObject } from "react";
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
  const { getFilteredCities } = useFilters();
  const { prioritizedPlaces, visiblePlacesInView, viewMode } = useMap();

  // Get all filtered places for total count
  const allFilteredPlaces = getFilteredCities(cities, () => ({
    matchScore: 1,
    attributeMatches: {
      budget: 1,
      crowds: 1,
      tripLength: 1,
      season: 1,
      transit: 1,
      accessibility: 1,
    },
  }));

  // Use different data source based on view mode
  const displayPlaces =
    viewMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;

  // Get the correct total count based on view mode
  const totalPlaces =
    viewMode === "list" ? allFilteredPlaces.length : visiblePlacesInView.length;
  const placesInView =
    viewMode === "list" ? totalPlaces : visiblePlacesInView.length;

  return (
    <div className="h-full flex">
      <div
        className={cn(
          "flex flex-col  bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
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
                <div className="h-full flex items-center justify-center">
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
                <div
                  className={cn(
                    "grid gap-6 auto-rows-[minmax(min-content,max-content)]",
                    viewMode === "list"
                      ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                      : "grid-cols-2"
                  )}
                >
                  {displayPlaces.map((place) => (
                    <PlaceCard key={place.id} city={place} variant="basic" />
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              <div
                ref={observerTarget}
                className={cn(
                  "h-32 flex items-center justify-center transition-all duration-200",
                  isLoadingMore && displayPlaces.length < cities.length
                    ? "opacity-100"
                    : "opacity-0"
                )}
              >
                <div className="flex flex-col items-center gap-3 bg-primary px-6 py-4 rounded-xl">
                  <div className="animate-spin h-10 w-10 border-[3px] border-background border-t-transparent rounded-full" />
                  <span className="text-sm font-medium text-background animate-pulse">
                    Loading more places...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
