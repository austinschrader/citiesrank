import { useMap } from "@/features/map/context/MapContext";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { PageSizeSelect } from "./PageSizeSelect"; 
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { RefObject } from "react";

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
  itemsPerPage,
  onPageSizeChange,
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
          "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
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
          {/* Header Section with Flexbox Layout */}
          <div className="shrink-0 border-b bg-background/50 backdrop-blur-sm">
            {isLoadingMore && (
              <div className="relative h-1 bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-primary/80 animate-loading-bar" />
              </div>
            )}
            <div className="p-4">
              {/* Results count and page size selector */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {displayPlaces.length} loaded
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{placesInView}</span>
                  <span className="text-muted-foreground">places in view</span>
                </div>
                <div className="flex items-center gap-4">
                  <PageSizeSelect
                    value={itemsPerPage}
                    onChange={onPageSizeChange}
                  />
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-full">
                      <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-background">
                        Loading more...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Grid of cards */}
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
