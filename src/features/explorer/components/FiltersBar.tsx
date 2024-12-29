import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
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

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const {
    energyMode,
    timeRange,
    setEnergyMode,
    setTimeRange,
    viewMode,
    setViewMode,
  } = useHeader();
  const [sort, setSort] = useState("popular");
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border-b bg-white/90 backdrop-blur-sm">
      <div className="h-full flex flex-col w-full">
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
              <div className="h-8 w-px bg-gray-200" />
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-gray-50/50 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters (collapsed by default) */}
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out border-t",
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[200px] opacity-100"
          )}
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[4.7, 4.5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setFilters({ ...filters, averageRating: rating })
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        filters.averageRating === rating
                          ? "bg-indigo-500 text-white"
                          : "bg-white hover:bg-indigo-50 text-gray-700"
                      )}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Population Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Population</label>
                <div className="flex flex-wrap gap-2">
                  {["Small", "Medium", "Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setFilters({ ...filters, populationCategory: size })
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        filters.populationCategory === size
                          ? "bg-indigo-500 text-white"
                          : "bg-white hover:bg-indigo-50 text-gray-700"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Travel Style</label>
                <div className="flex flex-wrap gap-2">
                  {["Budget", "Mid-Range", "Luxury"].map((style) => (
                    <button
                      key={style}
                      onClick={() =>
                        setFilters({ ...filters, travelStyle: style })
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        filters.travelStyle === style
                          ? "bg-indigo-500 text-white"
                          : "bg-white hover:bg-indigo-50 text-gray-700"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Season</label>
                <div className="flex flex-wrap gap-2">
                  {["Spring", "Summer", "Fall", "Winter"].map((season) => (
                    <button
                      key={season}
                      onClick={() => setFilters({ ...filters, season })}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        filters.season === season
                          ? "bg-indigo-500 text-white"
                          : "bg-white hover:bg-indigo-50 text-gray-700"
                      )}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
