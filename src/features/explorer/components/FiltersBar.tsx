import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Landmark, ListPlus, Scroll, Search, Wrench } from "lucide-react";
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

  return (
    <div className="border-b bg-white/90 backdrop-blur-sm">
      <div className="h-full flex flex-col w-full">
        <div className="py-2.5 px-4 flex items-center justify-between gap-8">
          {/* Left: Search and View Toggle */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-[280px]">
              <Input
                type="text"
                placeholder="Discover active spaces nearby..."
                className="w-full pl-9 h-9 bg-white shadow-sm border hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 rounded-lg transition-all duration-200 text-sm placeholder:text-indigo-300"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            </div>

            <div className="h-6 w-px bg-indigo-200" />

            {/* Places/Lists Toggle */}
            <div className="flex items-center gap-1.5">
              <Toggle
                pressed={viewMode === "places"}
                onPressedChange={() => setViewMode("places")}
                className={cn(
                  viewMode === "places"
                    ? activeButtonStyles
                    : inactiveButtonStyles
                )}
              >
                <Landmark className="w-4 h-4" />
                <span>Places</span>
              </Toggle>
              <Toggle
                pressed={viewMode === "lists"}
                onPressedChange={() => setViewMode("lists")}
                className={cn(
                  viewMode === "lists"
                    ? activeButtonStyles
                    : inactiveButtonStyles
                )}
              >
                <Scroll className="w-4 h-4" />
                <span>Lists</span>
              </Toggle>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center">
            {/* Primary Action */}
            <Button variant="ghost" className={cn(activeButtonStyles)} asChild>
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

            <div className="h-8 w-px bg-indigo-200 mx-6" />

            {/* Time Window */}
            <TimeWindow
              energyMode={energyMode}
              timeRange={timeRange}
              onEnergyChange={setEnergyMode}
              onTimeChange={setTimeRange}
            />

            <div className="h-8 w-px bg-indigo-200 mx-6" />

            {/* View Mode */}
            <ViewModeToggle />

            <div className="h-8 w-px bg-indigo-200 mx-6" />

            <PageSizeSelect />

            <div className="h-8 w-px bg-indigo-200 mx-6" />

            {/* Filters */}
            <FiltersSheet sort={sort} onSortChange={setSort} />
          </div>
        </div>
      </div>
    </div>
  );
};
