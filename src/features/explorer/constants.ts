export const CATEGORIES = {
  PRIMARY: ["Popular", "Nature", "Urban", "Food", "Photography", "Hidden Gems"],
  TYPES: ["Route", "Collection", "Guide", "Bucket List"],
  TIMEFRAMES: ["This Week", "This Month", "This Year", "All Time"],
} as const;

export const LIST_TAGS = {
  timeframe: ["all-time", "yearly", "2024", "seasonal", "monthly"],
  type: ["ranked", "bucket-list", "personal", "professional", "curated"],
  category: ["travel", "food", "culture", "adventure", "photography"],
  audience: ["solo", "couples", "families", "budget", "luxury"],
  verification: ["verified", "community-tested", "expert-picked"],
};
