/**
 * Contains filter categories that are fully implemented and working
 * These will be merged with other filter categories from filter-categories.ts
 */
import { Category } from "@/features/places/search/components/filters/shared/types";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const implementedFilters: Category[] = [
  {
    id: "placeTypes",
    title: "Place Types",
    emoji: "🌍",
    color: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    singleSelect: true,
    filters: [
      {
        label: CitiesTypeOptions.country,
        emoji: "🗺️",
      },
      {
        label: CitiesTypeOptions.region,
        emoji: "🌄",
      },
      {
        label: CitiesTypeOptions.city,
        emoji: "🌆",
      },
      {
        label: CitiesTypeOptions.neighborhood,
        emoji: "🏘️",
      },
      {
        label: CitiesTypeOptions.sight,
        emoji: "🗽",
      },
    ],
  },
];
