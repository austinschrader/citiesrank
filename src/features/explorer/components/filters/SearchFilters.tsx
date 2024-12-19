// src/features/explorer/components/filters/SearchFilters.tsx
// Handles search, rating, and population filters for the ResultsPanel

import { Input } from "@/components/ui/input";
import {
  PopulationCategory,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { Star } from "lucide-react";

const citySizeEmojis: Record<PopulationCategory, string> = {
  megacity: "🌇",
  city: "🏙️",
  town: "🏰",
  village: "🏡",
};

export function SearchFilters() {
  const { filters, setFilters, handlePopulationSelect, handleRatingChange } =
    useFilters();

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search places..."
          className="w-full pl-9"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Rating and Size Filters */}
      <div className="grid grid-cols-2 gap-3">
        {/* Rating Filter */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Rating
          </span>
          <div className="inline-flex items-center gap-1 bg-muted/50 rounded-md px-2">
            <Star className="h-3.5 w-3.5 text-muted-foreground fill-muted-foreground" />
            <Input
              type="number"
              value={filters.averageRating ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseFloat(value);
                if (!value) {
                  handleRatingChange(null);
                } else if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
                  handleRatingChange(numValue);
                }
              }}
              className="w-12 h-7 text-center bg-transparent border-0 p-0 focus-visible:ring-0"
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0"
            />
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
        </div>

        {/* City Size Filter */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Size
          </span>
          <div className="flex flex-wrap gap-1">
            {Object.entries({
              village: { emoji: "🏘️", label: "Village" },
              town: { emoji: "🏰", label: "Town" },
              city: { emoji: "🌆", label: "City" },
              megacity: { emoji: "🌇", label: "Megacity" },
            }).map(([size, { emoji, label }]) => (
              <button
                key={size}
                onClick={() =>
                  handlePopulationSelect(
                    filters.populationCategory === size
                      ? null
                      : (size as PopulationCategory)
                  )
                }
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-xs font-medium",
                  "transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-1 focus:ring-primary",
                  filters.populationCategory === size
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-200",
                      filters.populationCategory === size
                        ? "opacity-100 scale-125"
                        : "opacity-40"
                    )}
                    style={{
                      backgroundColor: markerColors[CitiesTypeOptions.city],
                    }}
                  />
                  <span
                    className="text-base"
                    role="img"
                    aria-label={`${size} emoji`}
                  >
                    {citySizeEmojis[size as PopulationCategory]}
                  </span>
                  <span className="capitalize">{size}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
