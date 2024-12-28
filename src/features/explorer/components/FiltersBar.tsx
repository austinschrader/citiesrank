import { Input } from "@/components/ui/input";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useHeader } from "@/features/header/context/HeaderContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Search } from "lucide-react";
import { useState } from "react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { energyMode, timeRange, setEnergyMode, setTimeRange } = useHeader();
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
          <div className="flex items-center">
            {/* Energy and Time Controls */}
            <div className="flex items-center pr-6 border-r border-border">
              <TimeWindow
                energyMode={energyMode}
                timeRange={timeRange}
                onEnergyChange={setEnergyMode}
                onTimeChange={setTimeRange}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="px-6 border-r border-border">
              <ViewModeToggle />
            </div>

            {/* Filters */}
            <div className="pl-6">
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
