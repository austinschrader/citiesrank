/**
 * Location: src/features/places/components/Hero/constants.ts
 * Purpose: Contains type definitions and constants for place search functionality
 * Used by: Hero.tsx
 */

export type PlaceType = "countries" | "regions" | "cities" | "sights";

export const PLACE_TYPES = [
  {
    id: "countries" as const,
    label: "Countries",
    placeholder: "Search for countries to explore...",
    header: "Find your perfect country to call home",
  },
  {
    id: "regions" as const,
    label: "Regions",
    placeholder: "Find your perfect region...",
    header: "Discover the best region for your lifestyle",
  },
  {
    id: "cities" as const,
    label: "Cities",
    placeholder: "Discover cities worldwide...",
    header: "Find your perfect city to live in",
  },
  {
    id: "sights" as const,
    label: "Sights",
    placeholder: "Explore amazing attractions...",
    header: "Explore the world's most amazing places",
  },
] as const;
