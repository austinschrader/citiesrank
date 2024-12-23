import { Input } from "@/components/ui/input";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { SortControl } from "@/features/explorer/components/filters/SortControl";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { useMap } from "@/features/map/context/MapContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { Search } from "lucide-react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();
  const { viewMode } = useMap();

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex flex-col gap-4 px-4 py-3">
        {/* Top Row: Search and Controls */}
        <div className="flex flex-wrap items-center gap-4 max-w-full overflow-x-hidden">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Find active spaces nearby..."
              className="w-full pl-9 h-10 bg-background/60"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Mobile View: Essential Controls */}
          <div className="flex items-center gap-3 sm:hidden">
            <FiltersSheet />
            <SortControl />
            <ViewModeToggle />
          </div>

          {/* Desktop View: Full Controls */}
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end sm:gap-3">
            <SortControl />
            <FiltersSheet />
            <ViewModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
