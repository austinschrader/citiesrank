/**
 * Predefined tags for categorizing cities and places.
 * These tags represent common attributes and characteristics of destinations.
 */
const PLACE_TAGS = [
  // Culture & Lifestyle
  "culture",
  "art",
  "history",
  "nightlife",
  "food",
  "shopping",
  "music",
  "fashion",

  // Environment
  "nature",
  "beach",
  "mountains",
  "urban",
  "rural",
  "tropical",
  "desert",

  // Activities
  "adventure",
  "sports",
  "hiking",
  "skiing",
  "surfing",
  "diving",

  // Characteristics
  "romantic",
  "family-friendly",
  "budget-friendly",
  "luxury",
  "peaceful",
  "bustling",
  "historic",
  "modern",
  "traditional",
  "innovative",

  // Special Interest
  "technology",
  "education",
  "business",
] as const;

export type PlaceTag = (typeof PLACE_TAGS)[number];

/**
 * Get a human-readable label for a tag
 */
export const getTagLabel = (tag: PlaceTag): string => {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
