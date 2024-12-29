import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Landmark,
  ListPlus,
  Scroll,
  Search,
  Wrench,
} from "lucide-react";
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
    setViewMode,
    viewMode,
  } = useHeader();
  const [sort, setSort] = useState("popular");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { cities } = useCities();
  const { getFilteredCities } = useFilters();
  const { prioritizedPlaces, visiblePlacesInView, viewMode: mapViewMode } = useMap();

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
    mapViewMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;

  // Get the correct total count based on view mode
  const totalPlaces =
    mapViewMode === "list"
      ? allFilteredPlaces.length
      : visiblePlacesInView.length;
  const placesInView =
    mapViewMode === "list" ? totalPlaces : visiblePlacesInView.length;

  return (
    <div className="border-b bg-white/90 backdrop-blur-sm">
      <div className="h-full flex flex-col w-full">
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[200px] opacity-100"
          )}
        >
          <div className="py-2.5 px-4 flex items-center justify-between gap-8">
            {/* Left: Primary Actions */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="relative w-[280px]">
                <Input
                  type="text"
                  placeholder="Discover what's nearby..."
                  className="w-full pl-9 h-9 bg-white shadow-sm border hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 rounded-lg transition-all duration-200 text-md placeholder:text-indigo-400"
                  value={filters.search || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
              </div>

              <div className="shrink-0 border-b bg-background/50 backdrop-blur-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Places</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {displayPlaces.length} loaded
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">{placesInView}</span>
                        <span className="text-muted-foreground">
                          places in view
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-indigo-200/60" />

              {/* Mode Toggle */}
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

              <div className="h-8 w-px bg-indigo-200/60" />

              {/* Primary Action Button */}
              <Button
                variant="ghost"
                className={cn(
                  activeButtonStyles,
                  "bg-green-500 hover:bg-green-600",
                  "h-9 text-md font-medium"
                )}
                asChild
              >
                <Link
                  to={viewMode === "places" ? "/my-places" : "/lists/create"}
                  className="flex items-center gap-2"
                >
                  {viewMode === "places" ? (
                    <>
                      <Wrench className="w-4 h-4" />
                      Manage Places
                    </>
                  ) : (
                    <>
                      <ListPlus className="w-4 h-4" />
                      Create List
                    </>
                  )}
                </Link>
              </Button>
            </div>

            {/* Right: View Controls and Utilities */}
            <div className="flex items-center gap-4">
              {/* Results Controls */}
              <div className="flex items-center gap-4 px-4 py-1.5 rounded-lg">
                <PageSizeSelect />
                <FiltersSheet sort={sort} onSortChange={setSort} />
              </div>

              <div className="h-8 w-px bg-indigo-200/60" />

              {/* View Controls */}
              <div className="flex items-center gap-4 px-4 py-1 rounded-lg">
                <TimeWindow
                  energyMode={energyMode}
                  timeRange={timeRange}
                  onEnergyChange={setEnergyMode}
                  onTimeChange={setTimeRange}
                />
                <div className="h-8 w-px bg-gray-200" />
                <ViewModeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full h-6 text-muted-foreground hover:text-foreground hover:bg-gray-50/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};
