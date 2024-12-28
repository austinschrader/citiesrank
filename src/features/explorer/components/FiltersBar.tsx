import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Search, Map, List, MapPin, ListPlus } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { energyMode, timeRange, setEnergyMode, setTimeRange, viewMode, setViewMode } = useHeader();
  const [sort, setSort] = useState("popular");

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="h-full flex flex-col w-full">
        <div className="py-2.5 px-4 flex items-center justify-between gap-8">
          {/* Left: Search */}
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="Discover active spaces nearby..."
              className="w-full pl-9 h-10 bg-background/60"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Right: Controls Group */}
          <div className="flex items-center space-x-6">
            {/* Places/Lists Toggle with Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-1">
                <Toggle
                  pressed={viewMode === "places"}
                  onPressedChange={() => setViewMode("places")}
                  size="sm"
                  className="data-[state=on]:bg-indigo-100"
                >
                  <Map className="h-4 w-4" />
                  <span className="ml-2">Places</span>
                </Toggle>
                <Toggle
                  pressed={viewMode === "lists"}
                  onPressedChange={() => setViewMode("lists")}
                  size="sm"
                  className="data-[state=on]:bg-indigo-100"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-2">Lists</span>
                </Toggle>
              </div>

              {viewMode === "places" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600",
                    "transition-all duration-200 shadow-sm"
                  )}
                >
                  <Link to="/my-places" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Manage Places
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600",
                    "transition-all duration-200 shadow-sm"
                  )}
                >
                  <Link to="/lists/create" className="flex items-center gap-2">
                    <ListPlus className="w-4 h-4" />
                    Create New List
                  </Link>
                </Button>
              )}
            </div>

            {/* Energy and Time Controls */}
            <div className="flex items-center border-l border-border pl-6">
              <TimeWindow
                energyMode={energyMode}
                timeRange={timeRange}
                onEnergyChange={setEnergyMode}
                onTimeChange={setTimeRange}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="border-l border-border pl-6">
              <ViewModeToggle />
            </div>

            {/* Filters */}
            <div className="border-l border-border pl-6">
              <FiltersSheet 
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
