import slugify from "slugify";
import type { ValidationResult } from '../types/places';

export const normalizeString = (str: string): string => {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-']/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

export const createSlug = (name: string, country: string): string => {
  const processedName = name.replace(/[']/g, "");
  return slugify(`${processedName}-${country}`, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const normalizeScore = (score: number | null | undefined): number => {
  if (score === null || score === undefined) return 0;
  return score > 10 ? score / 10 : score;
};

export const validatePlace = (data: any): ValidationResult => {
  const errors: string[] = [];

  const validateText = (value: any, field: string, min?: number, max?: number) => {
    if (!value || typeof value !== "string") {
      errors.push(`${field} is required and must be a string`);
      return;
    }
    if (min && value.length < min) {
      errors.push(`${field} must be at least ${min} characters`);
    }
    if (max && value.length > max) {
      errors.push(`${field} must be at most ${max} characters`);
    }
  };

  const validateNumber = (value: any, field: string) => {
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value !== "number") {
      errors.push(`${field} must be a number`);
    }
  };

  validateText(data.name, "name", 1, 100);
  validateText(data.country, "country", 1, 100);
  validateText(data.description, "description", 10, 500);

  // Population must be a number
  if (data.population && typeof data.population !== "number") {
    errors.push("population must be a number");
  }

  const numberFields = [
    "cost",
    "interesting",
    "transit",
    "crowdLevel",
    "recommendedStay",
    "bestSeason",
    "accessibility",
    "costIndex",
    "safetyScore",
    "walkScore",
    "transitScore",
    "latitude",
    "longitude",
    "averageRating",
    "totalReviews",
  ];
  numberFields.forEach((field) => validateNumber(data[field], field));

  if (data.highlights) {
    try {
      if (typeof data.highlights === "string") {
        JSON.parse(data.highlights);
      } else {
        JSON.stringify(data.highlights);
      }
    } catch (e) {
      errors.push("highlights must be valid JSON");
    }
  }

  const normalizedName = normalizeString(data.name || "");
  const slug = createSlug(data.name || "", data.country || "");

  const transformedData = {
    ...data,
    normalizedName,
    slug,
    type: Array.isArray(data.type) ? data.type : [data.type || "city"],
    population: typeof data.population === "number" ? data.population : 0,
    highlights: JSON.stringify(
      data.highlights || [
        `Explore ${data.name || ""}`,
        "Experience local culture",
        "Visit historic sites",
        "Enjoy local cuisine",
        "Discover natural beauty",
      ]
    ),
    interesting: normalizeScore(data.interesting),
    transit: normalizeScore(data.transit),
    crowdLevel: normalizeScore(data.crowdLevel),
    recommendedStay: normalizeScore(data.recommendedStay),
    bestSeason: normalizeScore(data.bestSeason),
    accessibility: normalizeScore(data.accessibility),
    costIndex: normalizeScore(data.costIndex),
    transitScore: normalizeScore(data.transitScore),
    walkScore: normalizeScore(data.walkScore),
    safetyScore: normalizeScore(data.safetyScore),
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
  };

  return {
    name: data.name || "Unknown Place",
    isValid: errors.length === 0,
    errors,
    data: transformedData,
  };
};
