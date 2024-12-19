import { Button } from "@/components/ui/button";
import { useMap } from "@/features/map/context/MapContext";
import { MapPlace } from "@/features/map/types";
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { RefObject } from "react";
import { ActiveFilters } from "./filters/ActiveFilters";
import { SearchFilters } from "./filters/SearchFilters";

interface ResultsPanelProps {
  isLoadingMore: boolean;
  observerTarget: RefObject<HTMLDivElement>;
  isResultsPanelCollapsed: boolean;
  setIsResultsPanelCollapsed: (value: boolean) => void;
}

export const ResultsPanel = ({
  isLoadingMore,
  observerTarget,
  isResultsPanelCollapsed,
  setIsResultsPanelCollapsed,
}: ResultsPanelProps) => {
  const { prioritizedPlaces, visiblePlacesInView, visiblePlaces } = useMap();

  return (
    <div className="relative flex">
      <div
        className={cn(
          "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isResultsPanelCollapsed ? "w-0" : "w-[800px]"
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
            <div className="p-4 flex justify-between items-start">
              <div className="space-y-4">
                {/* Title and Results Count */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Discover Places</h2>
                  <div className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {visiblePlaces.length}
                  </div>
                </div>

                {/* Filters Section */}
                <SearchFilters />

                {/* Active Filters */}
                <ActiveFilters />
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
                  <span className="text-muted-foreground">
                    {prioritizedPlaces.length} loaded
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">
                    {visiblePlacesInView.length}
                  </span>
                  <span className="text-muted-foreground">places in view</span>
                </div>
                {isLoadingMore && (
                  <div className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-full">
                    <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-background">
                      Loading more...
                    </span>
                  </div>
                )}
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-2 gap-6 auto-rows-[minmax(min-content,max-content)]">
                {prioritizedPlaces.map((place: MapPlace) => (
                  <PlaceCard key={place.id} city={place} variant="basic" />
                ))}
              </div>

              {/* Loading indicator */}
              <div
                ref={observerTarget}
                className={cn(
                  "h-32 flex items-center justify-center transition-all duration-200",
                  isLoadingMore &&
                    prioritizedPlaces.length < visiblePlacesInView.length
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
