import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  FeedItemsSourceTypeOptions,
  FeedItemsTypeOptions,
} from "@/lib/types/pocketbase-types";
import { useState } from "react";
import { z } from "zod";
import type { ValidationResult } from "../types/validation";

// Base schema for all feed items
const baseFeedItemSchema = z.object({
  type: z.nativeEnum(FeedItemsTypeOptions),
  source_type: z.nativeEnum(FeedItemsSourceTypeOptions),
  source_name: z.string(),
  timestamp: z.string(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    image_url: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  }),
});

// Schema for trending places
const trendingPlaceSchema = baseFeedItemSchema.extend({
  type: z.literal(FeedItemsTypeOptions.trending_place),
  place: z.string(),
  stats: z.object({
    views_last_week: z.number(),
    view_increase: z.number(),
    saves_last_week: z.number(),
  }),
});

// Schema for place collections
const placeCollectionSchema = baseFeedItemSchema.extend({
  type: z.literal(FeedItemsTypeOptions.place_collection),
  places: z.array(z.string()),
});

// Schema for tag spotlights
const tagSpotlightSchema = baseFeedItemSchema.extend({
  type: z.literal("tag_spotlight"),
  tag: z.string(),
  stats: z.object({
    places_count: z.number(),
    average_rating: z.number().optional(),
  }),
});

// Schema for place updates
const placeUpdateSchema = baseFeedItemSchema.extend({
  type: z.literal("place_update"),
  place: z.string(),
  content: z.object({
    title: z.string(),
    description: z.string(),
    changes: z.array(
      z.object({
        field: z.string(),
        old_value: z.any().optional(),
        new_value: z.any().optional(),
        reason: z.string().optional(),
        update: z.string().optional(),
      })
    ),
  }),
});

// Schema for similar places
const similarPlacesSchema = baseFeedItemSchema.extend({
  type: z.literal("similar_places"),
  place: z.string(),
  places: z.array(z.string()),
  stats: z.object({
    average_cost: z.number(),
    average_transit_score: z.number(),
    average_walk_score: z.number(),
  }),
});

// Schema for photo challenges
const photoChallengeSchema = baseFeedItemSchema.extend({
  type: z.literal("photo_challenge"),
  // Add properties specific to photo challenges here
});

// Schema for friend activities
const friendActivitySchema = baseFeedItemSchema.extend({
  type: z.literal("friend_activity"),
  // Add properties specific to friend activities here
});

export function useValidateFeedItems() {
  const { toast } = useToast();
  const { pb } = useAuth();
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  const resolvePlaceIds = async (
    slugs: string[]
  ): Promise<{ [key: string]: string }> => {
    const placeIds: { [key: string]: string } = {};
    const errors: string[] = [];

    console.log("Resolving slugs:", slugs);

    for (const slug of slugs) {
      try {
        // First verify the slug format
        console.log("Looking up city with slug:", slug);
        const record = await pb
          .collection("cities")
          .getFirstListItem(`slug="${slug}"`);
        console.log("Found city record:", record);
        placeIds[slug] = record.id;

        // Verify the ID exists
        const verifyRecord = await pb.collection("cities").getOne(record.id);
        console.log("Verified city record exists:", verifyRecord.id);
      } catch (error) {
        console.error(`Error resolving place ${slug}:`, error);
        errors.push(`Place not found: ${slug}`);
      }
    }

    console.log("Resolved place IDs:", placeIds);
    return placeIds;
  };

  const validateFeedItem = async (item: unknown): Promise<ValidationResult> => {
    const baseResult = {
      name: `${(item as any).type} - ${(item as any).source_name}`,
      data: item,
      isValid: false,
      errors: [] as string[],
    };

    // Determine schema based on type
    let schema;
    switch ((item as any).type) {
      case FeedItemsTypeOptions.trending_place:
        schema = trendingPlaceSchema;
        break;
      case FeedItemsTypeOptions.place_collection:
        schema = placeCollectionSchema;
        break;
      case "tag_spotlight":
        schema = tagSpotlightSchema;
        break;
      case "place_update":
        schema = placeUpdateSchema;
        break;
      case "similar_places":
        schema = similarPlacesSchema;
        break;
      case "photo_challenge":
        schema = photoChallengeSchema;
        break;
      case "friend_activity":
        schema = friendActivitySchema;
        break;
      default:
        return {
          ...baseResult,
          errors: [`Unknown feed item type: ${(item as any).type}`],
        };
    }

    // Validate against schema
    const result = schema.safeParse(item);
    if (!result.success) {
      return {
        ...baseResult,
        errors: result.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        ),
      };
    }

    // Additional validation for items with place references
    const data = result.data;
    let validatedData = { ...data };

    // Type guard for objects with 'place' property
    if ("place" in data && typeof data.place === "string") {
      const placeIds = await resolvePlaceIds([data.place]);
      if (!placeIds[data.place]) {
        return {
          ...baseResult,
          errors: [`Place not found: ${data.place}`],
        };
      }
      (validatedData as any).place = placeIds[data.place];
    }

    // Type guard for objects with 'places' property
    if ("places" in data && Array.isArray(data.places)) {
      const placeIds = await resolvePlaceIds(data.places);
      const missingPlaces = data.places.filter((slug) => !placeIds[slug]);

      if (missingPlaces.length > 0) {
        return {
          ...baseResult,
          errors: [`Places not found: ${missingPlaces.join(", ")}`],
        };
      }

      // Convert to array of IDs for PocketBase
      const placeIdArray = data.places.map((slug) => placeIds[slug]);
      console.log("Place ID array:", placeIdArray);
      (validatedData as any).places = placeIdArray;
    }

    return {
      ...baseResult,
      isValid: true,
      data: validatedData,
    };
  };

  const validateFeedItems = async (items: unknown[]) => {
    const results = await Promise.all(items.map(validateFeedItem));
    setValidationResults(results);

    const validCount = results.filter((r) => r.isValid).length;
    toast({
      title: "File Validated",
      description: `Found ${results.length} feed items (${validCount} valid, ${
        results.length - validCount
      } invalid)`,
    });

    return results;
  };

  return {
    validationResults,
    validateFeedItems,
  };
}
