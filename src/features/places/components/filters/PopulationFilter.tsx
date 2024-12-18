// src/features/places/components/filters/PopulationFilter.tsx
// Population category filter buttons with visual indicators for different city sizes

import { useFilters } from "../../context/FiltersContext";
import type { PopulationCategory } from "../../context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Button } from "@/components/ui/button";

const populationCategories: { value: PopulationCategory; label: string; icon: string }[] = [
  { value: "village", label: "Village", icon: "🏘️" },
  { value: "town", label: "Town", icon: "🏰" },
  { value: "city", label: "City", icon: "🌆" },
  { value: "megacity", label: "Megacity", icon: "🌇" },
];

export function PopulationFilter() {
  const { filters, setFilters } = useFilters();

  const handlePopulationSelect = (category: PopulationCategory) => {
    setFilters({
      populationCategory: filters.populationCategory === category ? null : category,
      placeType: filters.populationCategory === category ? null : CitiesTypeOptions.city,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {populationCategories.map(({ value, label, icon }) => (
        <Button
          key={value}
          onClick={() => handlePopulationSelect(value)}
          variant={filters.populationCategory === value ? "default" : "outline"}
          className="flex items-center gap-2 transition-all hover:scale-105"
          size="sm"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
