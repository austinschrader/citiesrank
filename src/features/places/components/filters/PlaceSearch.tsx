/**
 * PlaceSearch: Search input for filtering places list
 * Dependencies:
 * - Uses FiltersContext to update global search filter
 * - Rendered by PlaceFilters as primary search
 */

import { useFilters } from "@/features/places/context/FiltersContext";
import { Search, X } from "lucide-react";

export const PlaceSearch = () => {
  const { filters, setFilter } = useFilters();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        placeholder="Search places..."
        value={filters.search}
        onChange={(e) => setFilter("search", e.target.value)}
        className="w-full pl-8 pr-8 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {filters.search && (
        <button
          onClick={() => setFilter("search", "")}
          className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
