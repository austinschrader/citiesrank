/**
 * PlaceTypeFilter: Handles place type filtering UI and logic
 * Dependencies:
 * - Uses FiltersContext for filter state management
 * - Consumed by PlaceFilters as the main filter section
 * - Uses CitiesTypeOptions from pocketbase-types for type definitions
 */

import { Button } from "@/components/ui/button";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import {
  Building2,
  Compass,
  Globe2,
  Home,
  Landmark,
  LucideIcon,
} from "lucide-react";

interface PlaceTypeFilterProps {
  searchQuery: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  placeTypeCounts: Record<string, number>;
}

interface PlaceTypeFilter {
  type: CitiesTypeOptions;
  label: string;
  icon: LucideIcon;
}

const placeTypeFilters: PlaceTypeFilter[] = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Compass },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  { type: CitiesTypeOptions.neighborhood, label: "Neighborhoods", icon: Home },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
];

export const PlaceTypeFilter = ({
  searchQuery,
  isCollapsed,
  onToggleCollapse,
  placeTypeCounts,
}: PlaceTypeFilterProps) => {
  const { filters, setFilter } = useFilters();

  const filteredTypes = placeTypeFilters.filter(
    (filter) =>
      !searchQuery ||
      filter.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterToggle = (type: CitiesTypeOptions) => {
    const newTypes = filters.activeTypes.includes(type)
      ? filters.activeTypes.filter((t) => t !== type)
      : [...filters.activeTypes, type];
    setFilter("activeTypes", newTypes.length ? newTypes : Object.values(CitiesTypeOptions));
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Section Header */}
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-between px-4 py-2 rounded-t-lg",
          "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800"
        )}
        onClick={onToggleCollapse}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">🗺️</span>
          <span className="font-medium">Place Type</span>
        </span>
        <span
          className={`transform transition-transform ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          ▼
        </span>
      </Button>

      {/* Filter Buttons */}
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          {filteredTypes.map((filter) => (
            <Button
              key={filter.type}
              variant={
                filters.activeTypes.includes(filter.type) ? "default" : "outline"
              }
              className="w-full justify-start gap-2"
              onClick={() => handleFilterToggle(filter.type)}
            >
              <filter.icon className="h-4 w-4" />
              <span>{filter.label}</span>
              {placeTypeCounts[filter.type] && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {placeTypeCounts[filter.type]}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
