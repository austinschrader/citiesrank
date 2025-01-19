import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useHeader } from "@/context/HeaderContext";
import { FiltersSheet } from "@/features/explore/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explore/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explore/components/TimeWindow";
import { useMap } from "@/features/map/context/MapContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Landmark, PlusCircle, Scroll, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageSizeSelect } from "./PageSizeSelect";

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

interface FiltersBarProps {
  paginatedFilteredPlaces: any[];
}

export const FiltersBar = ({ paginatedFilteredPlaces }: FiltersBarProps) => {
  const { filters, setFilters } = useFilters();
  const {
    energyMode,
    timeRange,
    setEnergyMode,
    setTimeRange,
    viewMode,
    setViewMode,
    isFiltersCollapsed,
  } = useHeader();
  const {
    prioritizedPlaces,
    visiblePlacesInView,
    viewMode: mapViewMode,
    visibleLists,
  } = useMap();
  const [sort, setSort] = useState("popular");

  // Calculate display counts based on view mode
  const displayPlaces =
    mapViewMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;
  const placesInView =
    mapViewMode === "list" ? displayPlaces.length : visiblePlacesInView.length;

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
            <div className="relative w-[180px] md:w-[220px]">
              <Input
                type="text"
                placeholder="Find your next adventure..."
                className="w-full pl-8 h-8 bg-white shadow-sm border hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 rounded-lg transition-all duration-200 text-sm placeholder:text-indigo-400"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <Toggle
                pressed={viewMode === "lists"}
                onPressedChange={() => setViewMode("lists")}
                className={cn(
                  viewMode === "lists"
                    ? activeButtonStyles
                    : inactiveButtonStyles
                )}
              >
                <Scroll className="w-3.5 h-3.5" />
                Collections
              </Toggle>
              <Toggle
                pressed={viewMode === "places"}
                onPressedChange={() => setViewMode("places")}
                className={cn(
                  viewMode === "places"
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
                {viewMode === "places"
                  ? displayPlaces.length
                  : visibleLists.length}{" "}
                loaded
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="font-medium text-xs">
                {viewMode === "places" ? placesInView : visibleLists.length}
              </span>
              <span className="text-muted-foreground text-xs">
                {viewMode === "places" ? "places in view" : "lists in view"}
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
                to={viewMode === "places" ? "/my-places" : "/lists/create"}
                className="flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New {viewMode === "places" ? "Place" : "List"}
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              <PageSizeSelect />
              <FiltersSheet sort={sort} onSortChange={setSort} />
            </div>

            <div className="flex items-center gap-3">
              <TimeWindow
                energyMode={energyMode}
                timeRange={timeRange}
                onEnergyChange={setEnergyMode}
                onTimeChange={setTimeRange}
              />
              <ViewModeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
