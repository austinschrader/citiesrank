/**
 * Toolbar component for managing filters and view modes.
 * Pure UI - gets all data from contexts.
 */
import { useHeader } from "@/context/HeaderContext";
import { SplitModeToggle } from "@/features/explore/components/layouts/SplitModeToggle";
import { FiltersSheet } from "@/features/explore/components/ui/filters/FiltersSheet";
import { useMap } from "@/features/map/context/MapContext";
import { SearchInput } from "@/features/places/components/ui/search/SearchInput";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { contentType, isFiltersCollapsed } = useHeader();
  const {
    prioritizedPlaces,
    visiblePlacesInView,
    splitMode,
    visibleLists,
    filteredPlaces,
  } = useMap();

  // Calculate display counts based on view mode
  const displayPlaces =
    splitMode === "list" ? filteredPlaces : prioritizedPlaces;
  const placesInView =
    splitMode === "list" ? displayPlaces.length : visiblePlacesInView.length;

  return (
    <div className="border-b bg-white/90 backdrop-blur-sm">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isFiltersCollapsed ? "h-0 overflow-hidden" : "h-[44px]"
        )}
      >
        <div className="h-full px-3 flex items-center gap-2 md:gap-3 overflow-x-auto md:overflow-visible">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <SplitModeToggle />
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-1">
            <div className="w-full max-w-md flex-shrink min-w-[150px]">
              <SearchInput
                value={filters.search || ""}
                onChange={(value) => setFilters({ ...filters, search: value })}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-xs">
                {contentType === "places"
                  ? displayPlaces.length
                  : visibleLists.length}
                <span className="hidden sm:inline"> loaded</span>
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="font-medium text-xs">
                {contentType === "places" ? placesInView : visibleLists.length}
              </span>
              <span className="text-muted-foreground text-xs hidden sm:inline">
                {contentType === "places" ? "places in view" : "lists in view"}
              </span>
            </div>

            <div className="h-6 w-px bg-indigo-200/60" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <FiltersSheet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
