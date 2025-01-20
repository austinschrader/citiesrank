/**
 * Toolbar component for managing filters and view modes.
 * Pure UI - gets all data from contexts.
 */
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useHeader } from "@/context/HeaderContext";
import { FiltersSheet } from "@/features/explore/components/ui/filters/FiltersSheet";
import { TimeWindow } from "@/features/explore/components/ui/TimeWindow";
import { useMap } from "@/features/map/context/MapContext";
import { SearchInput } from "@/features/places/components/ui/search/SearchInput";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Landmark, PlusCircle, Scroll } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SplitModeToggle } from "../layouts/SplitModeToggle";

const baseButtonStyles =
  "inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-all duration-200 border-0 outline-none ring-0 focus:ring-0";
const activeButtonStyles = cn(
  baseButtonStyles,
  "bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
);
const inactiveButtonStyles = cn(
  baseButtonStyles,
  "bg-white/80 hover:bg-indigo-500 hover:text-white text-indigo-600 shadow-sm"
);

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const {
    energyMode,
    timeRange,
    setEnergyMode,
    setTimeRange,
    contentType,
    setContentType,
    isFiltersCollapsed,
  } = useHeader();
  const {
    prioritizedPlaces,
    visiblePlacesInView,
    splitMode,
    visibleLists,
    filteredPlaces,
  } = useMap();
  const [sort, setSort] = useState("popular");

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
          <div className="flex items-center gap-2 md:gap-3 flex-1">
            <div className="flex-1 relative">
              <SearchInput
                value={filters.search || ""}
                onChange={(value) => setFilters({ ...filters, search: value })}
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <Toggle
                pressed={contentType === "lists"}
                onPressedChange={() => setContentType("lists")}
                className={cn(
                  contentType === "lists"
                    ? activeButtonStyles
                    : inactiveButtonStyles
                )}
              >
                <Scroll className="w-3.5 h-3.5" />
                Collections
              </Toggle>
              <Toggle
                pressed={contentType === "places"}
                onPressedChange={() => setContentType("places")}
                className={cn(
                  contentType === "places"
                    ? activeButtonStyles
                    : inactiveButtonStyles
                )}
              >
                <Landmark className="w-3.5 h-3.5" />
                Places
              </Toggle>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-xs">
                {contentType === "places"
                  ? displayPlaces.length
                  : visibleLists.length}{" "}
                loaded
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="font-medium text-xs">
                {contentType === "places" ? placesInView : visibleLists.length}
              </span>
              <span className="text-muted-foreground text-xs">
                {contentType === "places" ? "places in view" : "lists in view"}
              </span>
            </div>

            <div className="h-6 w-px bg-indigo-200/60" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                baseButtonStyles,
                "border border-input hover:bg-accent hover:text-accent-foreground"
              )}
              asChild
            >
              <Link
                to={contentType === "places" ? "/my-places" : "/lists/create"}
                className="flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New {contentType === "places" ? "Place" : "List"}
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              <FiltersSheet sort={sort} onSortChange={setSort} />
            </div>

            <div className="flex items-center gap-3">
              <TimeWindow
                energyMode={energyMode}
                timeRange={timeRange}
                onEnergyChange={setEnergyMode}
                onTimeChange={setTimeRange}
              />
              <SplitModeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
