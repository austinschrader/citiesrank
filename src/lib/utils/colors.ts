import { CitiesTypeOptions } from "../types/pocketbase-types";

// Centralized color definitions
export const markerColors: Record<CitiesTypeOptions | "default", string> = {
  [CitiesTypeOptions.country]: "#7C3AED", // Royal purple - dignified/sovereign
  [CitiesTypeOptions.region]: "#3B82F6", // Bright blue - regional/fresh
  [CitiesTypeOptions.city]: "#059669", // Emerald - vibrant/urban
  [CitiesTypeOptions.neighborhood]: "#F59E0B", // Amber - warm/community
  [CitiesTypeOptions.sight]: "#EC4899", // Pink - fun/attractions
  default: "#6b7280", // Gray
} as const;

export const ratingColors = {
  best: "#16a34a", // Vibrant green
  great: "#22c55e", // Bright green
  good: "#84cc16", // Lime green
  okay: "#facc15", // Yellow
  fair: "#f97316", // Orange
  poor: "#ef4444", // Red
  new: "#10b981", // Emerald - for new places
  none: "#6b7280", // Gray
} as const;
