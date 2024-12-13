/**
 * Location: src/features/places/components/Hero/constants.ts
 * Purpose: Contains UI constants for place search functionality
 * Used by: Hero.tsx
 */

import { CitiesTypeOptions } from '@/lib/types/pocketbase-types';

export const PLACE_TYPES = [
  {
    id: CitiesTypeOptions.country,
    label: "Countries",
    placeholder: "Search for countries to explore...",
    header: "Find your perfect country to call home",
  },
  {
    id: CitiesTypeOptions.region,
    label: "Regions",
    placeholder: "Find your perfect region...",
    header: "Discover the best region for your lifestyle",
  },
  {
    id: CitiesTypeOptions.city,
    label: "Cities",
    placeholder: "Discover cities worldwide...",
    header: "Find your perfect city to live in",
  },
  {
    id: CitiesTypeOptions.sight,
    label: "Sights",
    placeholder: "Explore amazing attractions...",
    header: "Explore the world's most amazing places",
  },
] as const;
