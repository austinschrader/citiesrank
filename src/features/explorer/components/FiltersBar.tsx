import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useMap } from "@/features/map/context/MapContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Landmark, PlusCircle, Scroll, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageSizeSelect } from "./PageSizeSelect";

const baseButtonStyles =
  "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all duration-200 border-0 outline-none ring-0 focus:ring-0";
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
          isFiltersCollapsed ? "h-0 overflow-hidden" : "h-[52px]"
        )}
      >
        <div className="h-full py-2.5 px-4 flex items-center justify-between gap-8">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <div className="relative w-[280px]">
              <Input
                type="text"
                placeholder="Find your next adventure..."
                className="w-full pl-9 h-9 bg-white shadow-sm border hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 rounded-lg transition-all duration-200 text-md placeholder:text-indigo-400"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1.5">
              <Toggle
                pressed={viewMode === "lists"}
                onPressedChange={() => setViewMode("lists")}
                className={cn(
                  viewMode === "lists"
                    ? activeButtonStyles
                    : inactiveButtonStyles,
                  "h-9 text-md font-medium"
                )}
              >
                <Scroll className="w-4 h-4" />
                <span>Lists</span>
              </Toggle>
              <Toggle
                pressed={viewMode === "places"}
                onPressedChange={() => setViewMode("places")}
                className={cn(
                  viewMode === "places"
                    ? activeButtonStyles
                    : inactiveButtonStyles,
                  "h-9 text-md font-medium"
                )}
              >
                <Landmark className="w-4 h-4" />
                <span>Places</span>
              </Toggle>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {viewMode === "places" ? (
                <>
                  <span className="text-muted-foreground">
                    {displayPlaces.length} loaded
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{placesInView}</span>
                  <span className="text-muted-foreground">places in view</span>
                </>
              ) : (
                <>
                  <span className="text-muted-foreground">
                    {visibleLists.length} loaded
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{visibleLists.length}</span>
                  <span className="text-muted-foreground">lists in view</span>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-indigo-200/60" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 text-md font-medium"
              asChild
            >
              <Link
                to={viewMode === "places" ? "/my-places" : "/lists/create"}
                className="flex items-center gap-2"
              >
                {viewMode === "places" ? (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>New Place</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    <span>New List</span>
                  </>
                )}
              </Link>
            </Button>

            <div className="flex items-center gap-4 px-4 py-1.5 rounded-lg">
              <PageSizeSelect />
              <FiltersSheet sort={sort} onSortChange={setSort} />
            </div>

            <div className="flex items-center gap-4 px-4 py-1 rounded-lg">
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
