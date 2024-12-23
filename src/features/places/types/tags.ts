/**
 * Predefined tags for categorizing cities and places.
 * These tags represent common attributes and characteristics of destinations.
 */
export const PLACE_TAGS = [
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

export type PlaceTag = typeof PLACE_TAGS[number];

/**
 * Groups of related tags for easier filtering and organization
 */
export const TAG_GROUPS = {
  culture: ["culture", "art", "history", "music", "fashion"] as PlaceTag[],
  lifestyle: ["nightlife", "food", "shopping"] as PlaceTag[],
  environment: ["nature", "beach", "mountains", "urban", "rural", "tropical", "desert"] as PlaceTag[],
  activities: ["adventure", "sports", "hiking", "skiing", "surfing", "diving"] as PlaceTag[],
  characteristics: ["romantic", "family-friendly", "budget-friendly", "luxury", "peaceful", "bustling", "historic", "modern", "traditional", "innovative"] as PlaceTag[],
  specialInterest: ["technology", "education", "business"] as PlaceTag[],
} as const;

/**
 * Get a human-readable label for a tag
 */
export const getTagLabel = (tag: PlaceTag): string => {
  return tag
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
