import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPlace } from "@/features/map/types";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { PopulationCategory } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { ChevronRight, Star } from "lucide-react";
import { RefObject } from "react";

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

const citySizeEmojis: Record<PopulationCategory, string> = {
  megacity: "🌇",
  city: "🏙️",
  town: "🏰",
  village: "🏡",
};

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
    <div
      className={cn(
        "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out relative",
        isResultsPanelCollapsed ? "w-0" : "w-[500px]"
      )}
    >
      {/* Panel toggle button */}
      <div
        className={cn(
          "absolute z-50 top-4",
          isResultsPanelCollapsed ? "-left-8" : "-right-8"
        )}
      >
        <button
          onClick={() => setIsResultsPanelCollapsed(!isResultsPanelCollapsed)}
          className={cn(
            "relative w-8 h-8",
            "bg-background border border-border shadow-sm rounded-r-lg",
            "flex items-center justify-center",
            "hover:bg-accent transition-colors"
          )}
          aria-label={
            isResultsPanelCollapsed
              ? "Expand results panel"
              : "Collapse results panel"
          }
        >
          <div className="flex items-center justify-center w-full h-full">
            <ChevronRight
              className={cn(
                "w-4 h-4 text-foreground transition-transform duration-200",
                !isResultsPanelCollapsed && "rotate-180"
              )}
            />
          </div>
        </button>
      </div>

      {/* Panel Content */}
      <div
        className={cn(
          "flex flex-col h-full transition-all duration-300",
          isResultsPanelCollapsed
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        )}
      >
        {/* Header Section */}
        <div className="shrink-0 p-4 border-b bg-background/50 backdrop-blur-sm space-y-4">
          {/* Title and Results Count */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Discover Places</h2>
            <div className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredPlaces.length}
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search places..."
                className="w-full pl-9"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Rating and Size Filters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Rating Filter */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Rating
                </span>
                <div className="inline-flex items-center gap-1 bg-muted/50 rounded-md px-2">
                  <Star className="h-3.5 w-3.5 text-muted-foreground fill-muted-foreground" />
                  <Input
                    type="number"
                    value={filters.averageRating ?? ""}
                    onChange={(e) => handleRatingChange(e.target.value)}
                    className="w-12 h-7 text-center bg-transparent border-0 p-0 focus-visible:ring-0"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                  />
                  <span className="text-xs text-muted-foreground">/5</span>
                </div>
              </div>

              {/* City Size Filter */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Size
                </span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries({
                    village: { emoji: "🏘️", label: "Village" },
                    town: { emoji: "🏰", label: "Town" },
                    city: { emoji: "🌆", label: "City" },
                    megacity: { emoji: "🌇", label: "Megacity" },
                  }).map(([size, { emoji, label }]) => (
                    <button
                      key={size}
                      onClick={() =>
                        handlePopulationSelect(
                          filters.populationCategory === size
                            ? null
                            : (size as PopulationCategory)
                        )
                      }
                      className={cn(
                        "px-1.5 py-0.5 rounded-md text-xs font-medium",
                        "transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-1 focus:ring-primary",
                        filters.populationCategory === size
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all duration-200",
                            filters.populationCategory === size
                              ? "opacity-100 scale-125"
                              : "opacity-40"
                          )}
                          style={{
                            backgroundColor: markerColors[CitiesTypeOptions.city],
                          }}
                        />
                        <span
                          className="text-base"
                          role="img"
                          aria-label={`${size} emoji`}
                        >
                          {citySizeEmojis[size as PopulationCategory]}
                        </span>
                        <span className="capitalize">{size}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {filters.search && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                        Search: "{filters.search}"
                      </span>
                    )}
                    {filters.averageRating && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                        ≥{filters.averageRating}★
                      </span>
                    )}
                    {filters.populationCategory && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                        {filters.populationCategory.charAt(0).toUpperCase() +
                          filters.populationCategory.slice(1)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
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
  );
};
