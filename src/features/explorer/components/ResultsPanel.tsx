import { Button } from "@/components/ui/button";
import { MapPlace } from "@/features/map/types";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { PopulationCategory } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { RefObject } from "react";
import { ActiveFilters } from "./filters/ActiveFilters";
import { SearchFilters } from "./filters/SearchFilters";

interface ResultsPanelProps {
  filteredPlaces: MapPlace[];
  paginatedPlaces: MapPlace[];
  filters: {
    search: string;
    averageRating: number | null;
    populationCategory: PopulationCategory | null;
  };
  setFilters: (filters: any) => void;
  activeFilterCount: number;
  clearAllFilters: () => void;
  handleRatingChange: (value: string) => void;
  handlePopulationSelect: (category: PopulationCategory | null) => void;
  isLoadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement>;
  isResultsPanelCollapsed: boolean;
  setIsResultsPanelCollapsed: (value: boolean) => void;
}

export const ResultsPanel = ({
  filteredPlaces,
  paginatedPlaces,
  filters,
  setFilters,
  activeFilterCount,
  clearAllFilters,
  handleRatingChange,
  handlePopulationSelect,
  isLoadingMore,
  observerTarget,
  isResultsPanelCollapsed,
  setIsResultsPanelCollapsed,
}: ResultsPanelProps) => {
  return (
    <div className="relative flex">
      <div
        className={cn(
          "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isResultsPanelCollapsed ? "w-0" : "w-[500px]"
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
            <div className="p-4 flex justify-between items-start">
              <div className="space-y-4">
                {/* Title and Results Count */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Discover Places</h2>
                  <div className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {filteredPlaces.length}
                  </div>
                </div>

                {/* Filters Section */}
                <SearchFilters
                  filters={filters}
                  setFilters={setFilters}
                  handleRatingChange={handleRatingChange}
                  handlePopulationSelect={handlePopulationSelect}
                />

                {/* Active Filters */}
                <ActiveFilters
                  filters={filters}
                  activeFilterCount={activeFilterCount}
                  clearAllFilters={clearAllFilters}
                />
              </div>

              {/* Panel toggle button */}
              <Button
                onClick={() =>
                  setIsResultsPanelCollapsed(!isResultsPanelCollapsed)
                }
                size="icon"
                aria-label={
                  isResultsPanelCollapsed
                    ? "Expand results panel"
                    : "Collapse results panel"
                }
              >
                <ChevronRight
                  className={cn(
                    "transition-transform duration-200",
                    !isResultsPanelCollapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grow overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
            <div className="p-4 space-y-6">
              {/* Results count */}
              <div className="flex items-center justify-between text-sm px-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Showing</span>
                  <span className="font-medium">{paginatedPlaces.length}</span>
                  <span className="text-muted-foreground">of</span>
                  <span className="font-medium">{filteredPlaces.length}</span>
                  <span className="text-muted-foreground">places</span>
                </div>
                {isLoadingMore && (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    Loading more...
                  </span>
                )}
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-2 gap-4 auto-rows-[minmax(min-content,max-content)]">
                {paginatedPlaces.map((place) => (
                  <PlaceCard key={place.id} city={place} variant="compact" />
                ))}
              </div>

              {/* Loading indicator */}
              <div
                ref={observerTarget}
                className={cn(
                  "h-16 flex items-center justify-center transition-opacity duration-200",
                  isLoadingMore ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapse/Expand button when panel is collapsed */}
      {isResultsPanelCollapsed && (
        <Button
          onClick={() => setIsResultsPanelCollapsed(false)}
          size="icon"
          className="absolute z-50 top-1/2 -translate-y-1/2 left-2"
          aria-label="Expand results panel"
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};
