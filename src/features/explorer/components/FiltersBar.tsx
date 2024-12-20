import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActiveFilters } from "@/features/explorer/components/filters/ActiveFilters";
import { CitySizeSheet } from "@/features/explorer/components/filters/CitySizeSheet";
import { FiltersSheet } from "@/features/explorer/components/filters/FiltersSheet";
import { PlaceTypesSheet } from "@/features/explorer/components/filters/PlaceTypesSheet";
import { RatingFilter } from "@/features/explorer/components/filters/RatingFilter";
import { SearchBar } from "@/features/explorer/components/filters/SearchBar";
import { SortControl } from "@/features/explorer/components/filters/SortControl";
import { ViewModeToggle } from "@/features/explorer/components/filters/ViewModeToggle";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";

export const FiltersBar = () => {
  const { filters, setFilters } = useFilters();

  const activeFiltersCount =
    (filters.activeTypes?.length || 0) +
    (filters.populationCategory ? 1 : 0) +
    (filters.averageRating ? 1 : 0);
  
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Search */}
        <div className="relative w-[300px]">
          <Input
            type="text"
            placeholder="Search places..."
            className="w-full pl-9 h-10 bg-background/60"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3">
          <PlaceTypesSheet />
          <CitySizeSheet />
          <RatingFilter />
          <FiltersSheet />
        </div>

        {/* Active Filters */}
        <div className="flex-1">
          {(filters.activeTypes.length > 0 ||
            filters.populationCategory ||
            filters.averageRating) && (
            <div className="flex items-center gap-2">
              <ActiveFilters />
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <SortControl />
          <div className="h-6 w-px bg-border" />
          <ViewModeToggle />
        </div>
      </div>
    </div>
  );
};
