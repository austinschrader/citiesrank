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
import { Landmark, Scroll } from "lucide-react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { contentType, setContentType, isFiltersCollapsed } = useHeader();
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

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => setContentType("lists")}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
                  contentType === "lists"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Scroll className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Collections</span>
              </button>
              <button
                onClick={() => setContentType("places")}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
                  contentType === "places"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Landmark className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Places</span>
              </button>
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
