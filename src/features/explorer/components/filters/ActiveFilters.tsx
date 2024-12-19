// src/features/explorer/components/filters/ActiveFilters.tsx
// Displays active filters and clear all button in ResultsPanel

import { Button } from "@/components/ui/button";
import { PopulationCategory } from "@/features/places/context/FiltersContext";

interface ActiveFiltersProps {
  filters: {
    search: string;
    averageRating: number | null;
    populationCategory: PopulationCategory | null;
  };
  activeFilterCount: number;
  clearAllFilters: () => void;
}

export function ActiveFilters({
  filters,
  activeFilterCount,
  clearAllFilters,
}: ActiveFiltersProps) {
  if (activeFilterCount === 0) return null;

  return (
    <div className="pt-2 border-t">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filters.search && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              Search: "{filters.search}"
            </span>
          )}
          {filters.averageRating && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              ≥{filters.averageRating}★
            </span>
          )}
          {filters.populationCategory && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {filters.populationCategory.charAt(0).toUpperCase() +
                filters.populationCategory.slice(1)}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}
