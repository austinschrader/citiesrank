// src/features/places/components/filters/PopulationFilter.tsx
// Population category filter buttons with visual indicators for different city sizes

import { Button } from "@/components/ui/button";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import type { PopulationCategory } from "../../context/FiltersContext";
import { useFilters } from "../../context/FiltersContext";

const populationCategories: {
  value: PopulationCategory;
  label: string;
  icon: string;
}[] = [
  { value: "village", label: "Village", icon: "🏘️" },
  { value: "town", label: "Town", icon: "🏰" },
  { value: "city", label: "City", icon: "🌆" },
  { value: "megacity", label: "Megacity", icon: "🌇" },
];

export function PopulationFilter() {
  const { filters, setFilters } = useFilters();

  const handleSelect = (category: PopulationCategory | null) => {
    setFilters({
      populationCategory: category,
      activeTypes: category
        ? [CitiesTypeOptions.city]
        : Object.values(CitiesTypeOptions),
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {populationCategories.map(({ value, label, icon }) => (
        <Button
          key={value}
          onClick={() => handleSelect(value)}
          variant={filters.populationCategory === value ? "default" : "outline"}
          className="flex items-center gap-2 transition-all hover:scale-105"
          size="sm"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
      <Button
        onClick={() => handleSelect(null)}
        variant={filters.populationCategory === null ? "default" : "outline"}
        className="flex items-center gap-2 transition-all hover:scale-105"
        size="sm"
      >
        <span>🗺️</span>
        <span>All</span>
      </Button>
    </div>
  );
}
