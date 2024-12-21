import { ClientResponseError } from "pocketbase";
import slugify from "slugify";
import { uploadImage } from "@/lib/cloudinary";
import { CitiesRecord, CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export interface ValidationResult {
  name: string;
  isValid: boolean;
  errors: string[];
  data: CitiesRecord;
}

const normalizeString = (str: string): string => {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[-']/g, " ") // Replace hyphens and apostrophes with spaces
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove any remaining special characters
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Normalize multiple spaces to single space
};

const createSlug = (name: string, country: string): string => {
  const processedName = name.replace(/[']/g, "");
  return slugify(`${processedName}-${country}`, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

const normalizeScore = (score: number | null | undefined): number => {
  if (score === null || score === undefined) return 0;
  // If score is greater than 10, assume it's on a 100 scale and convert
  return score > 10 ? score / 10 : score;
};

export const validatePlace = (data: Partial<CitiesRecord>): ValidationResult => {
  const errors: string[] = [];

  // Helper function to validate text fields
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

  // Helper function to validate number fields
  const validateNumber = (value: any, field: string, required = false) => {
    if (required && (value === undefined || value === null)) {
      errors.push(`${field} is required`);
      return;
    }
    if (value !== undefined && value !== null && typeof value !== "number") {
      errors.push(`${field} must be a number`);
    }
  };

  // Required text fields
  validateText(data.name, "name", 1, 100);
  validateText(data.country, "country", 1, 100);
  validateText(data.description, "description", 10, 500);

  // Required number fields
  validateNumber(data.cost, "cost", true);

  // Population can be "Unknown"
  if (data.population && typeof data.population !== "string") {
    errors.push("population must be a string");
  }

  // Validate all number fields - they're optional but must be numbers if present
  const numberFields = [
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
  numberFields.forEach((field) => validateNumber(data[field as keyof CitiesRecord], field));

  // Transform the data
  const normalizedName = normalizeString(data.name || "");
  const slug = createSlug(data.name || "", data.country || "");

  const transformedData: CitiesRecord = {
    name: data.name || "Unknown Place",
    normalizedName,
    country: data.country || "Unknown",
    description: data.description || "",
    slug,
    type: data.type || CitiesTypeOptions.sight,
    population: data.population || "Unknown",
    highlights: data.highlights || ["Explore the location", "Experience local culture", "Visit historic sites", "Enjoy local atmosphere", "Discover hidden gems"],
    // Required number fields with defaults
    cost: typeof data.cost === 'number' ? data.cost : 5,
    interesting: normalizeScore(data.interesting) || 0,
    transit: normalizeScore(data.transit) || 0,
    crowdLevel: normalizeScore(data.crowdLevel) || 0,
    recommendedStay: normalizeScore(data.recommendedStay) || 0,
    bestSeason: normalizeScore(data.bestSeason) || 0,
    accessibility: normalizeScore(data.accessibility) || 0,
    costIndex: normalizeScore(data.costIndex) || 0,
    transitScore: normalizeScore(data.transitScore) || 0,
    walkScore: normalizeScore(data.walkScore) || 0,
    safetyScore: normalizeScore(data.safetyScore) || 0,
    // Optional fields with defaults
    averageRating: data.averageRating || 0,
    totalReviews: data.totalReviews || 0,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    // Required by interface but can be empty
    imageUrl: data.imageUrl || "",
  };

  return {
    name: transformedData.name,
    isValid: errors.length === 0,
    errors,
    data: transformedData,
  };
};

export const uploadPlace = async (
  pb: any,
  placeData: Partial<CitiesRecord>,
  imageFile?: File
): Promise<{ success: boolean; error?: string; id?: string; slug?: string }> => {
  try {
    const validationResult = validatePlace(placeData);
    
    if (!validationResult.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validationResult.errors.join(", ")}`,
      };
    }

    // Check if place already exists
    try {
      await pb.collection("cities").getFirstListItem(`slug="${validationResult.data.slug}"`);
      return {
        success: false,
        error: `A place with the slug "${validationResult.data.slug}" already exists`,
      };
    } catch (error) {
      if (!(error instanceof ClientResponseError && error.status === 404)) {
        throw error;
      }
    }

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        const publicId = await uploadImage(imageFile, validationResult.data.slug);
        validationResult.data.imageUrl = publicId;
      } catch (error) {
        return {
          success: false,
          error: "Failed to upload image to Cloudinary",
        };
      }
    } else {
      // Set a default image URL if no image is provided
      validationResult.data.imageUrl = "places/default-place";
    }

    // Create the place record
    const record = await pb.collection("cities").create(validationResult.data);
    
    return { success: true, id: record.id, slug: record.slug };
  } catch (error) {
    const message = error instanceof ClientResponseError ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
};
