/**
 * Location: src/features/places/components/Hero/constants.ts
 * Purpose: Contains UI constants for place search functionality
 * Used by: Hero.tsx
 */

import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const PLACE_TYPES = [
  {
    id: CitiesTypeOptions.country,
    label: "Countries",
    placeholder: "Search countries to visit...",
    header: "Discover amazing countries to explore",
  },
  {
    id: CitiesTypeOptions.region,
    label: "Regions",
    placeholder: "Find scenic regions...",
    header: "Explore fascinating regions and areas",
  },
  {
    id: CitiesTypeOptions.city,
    label: "Cities",
    placeholder: "Find exciting cities...",
    header: "Discover vibrant cities to visit",
  },
  {
    id: CitiesTypeOptions.neighborhood,
    label: "Districts",
    placeholder: "Find local areas to explore...",
    header: "Discover authentic local neighborhoods",
  },
  {
    id: CitiesTypeOptions.sight,
    label: "Sights",
    placeholder: "Find must-see attractions...",
    header: "Explore unforgettable sights and landmarks",
  },
] as const;
