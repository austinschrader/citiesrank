/**
 * Feed item transformers for converting PocketBase records to typed feed items
 * Location: src/features/feed/transformers.ts
 * Used by: FeedContext
 */

import { ClientResponseError } from "pocketbase";
import { CitiesResponse as City } from "@/lib/types/pocketbase-types";
import {
  FeedItem,
  FeedItemType,
  PlaceCollectionItem,
  PlaceUpdateItem,
  PocketBaseRecord,
  SimilarPlacesItem,
  TagSpotlightItem,
  TrendingPlaceItem,
} from "./types";

export function createBaseFeedItem(record: PocketBaseRecord) {
  return {
    id: record.id,
    type: record.type as FeedItemType,
    timestamp: record.timestamp,
    source: {
      type: record.source_type,
      name: record.source_name,
    },
  };
}

function getPlaceIds(places: string | string[] | undefined | null): string[] {
  console.debug("Getting place IDs from:", {
    places,
    type: typeof places,
    isArray: Array.isArray(places)
  });

  if (!places) {
    console.debug("No places provided, returning empty array");
    return [];
  }

  if (Array.isArray(places)) {
    console.debug("Places is already an array:", places);
    return places;
  }

  if (typeof places === "string") {
    const ids = places.split(",").map(id => id.trim()).filter(Boolean);
    console.debug("Converted string to place IDs:", {
      original: places,
      parsed: ids
    });
    return ids;
  }

  console.debug("Unhandled places type, returning empty array");
  return [];
}

async function safeGetCityById(
  id: string | undefined | null,
  getCityById: (id: string) => Promise<City | null>
): Promise<City | null> {
  console.debug("Fetching city:", { id });

  if (!id) {
    console.debug("No city ID provided");
    return null;
  }

  try {
    const city = await getCityById(id);
    console.debug("City fetch result:", {
      id,
      found: !!city,
      city
    });
    return city;
  } catch (error) {
    if (!(error instanceof ClientResponseError)) {
      console.error("Error fetching city:", {
        id,
        error
      });
    }
    return null;
  }
}

export async function transformFeedItem(
  record: PocketBaseRecord,
  getCityById: (id: string) => Promise<City | null>
): Promise<FeedItem | null> {
  try {
    const baseItem = createBaseFeedItem(record);

    switch (record.type) {
      case "trending_place": {
        const place = await safeGetCityById(record.place, getCityById);
        if (!place) return null;
        return {
          ...baseItem,
          type: "trending_place",
          place,
          stats: record.stats || {},
          trendingTags: record.stats?.trendingTags || [],
        } as TrendingPlaceItem;
      }

      case "place_collection": {
        console.debug("Processing place_collection:", {
          id: record.id,
          rawPlaces: record.places
        });

        const placeIds = getPlaceIds(record.places);
        console.debug("Got place IDs:", placeIds);

        const places = await Promise.all(
          placeIds.map((id) => safeGetCityById(id, getCityById))
        );
        console.debug("Fetched places:", {
          total: places.length,
          valid: places.filter(Boolean).length,
          places
        });

        const validPlaces = places.filter(Boolean);
        if (!validPlaces.length) {
          console.debug("No valid places found, skipping item");
          return null;
        }

        const result = {
          ...baseItem,
          type: "place_collection",
          title: record.content?.title || "",
          description: record.content?.description || "",
          places: validPlaces,
          curator: {
            name: "Local Guide",
            avatar: "/default-avatar.png",
            contributionCount: record.stats?.contributionCount || 0,
            expertise: record.stats?.expertise || "",
          },
          savedCount: record.stats?.savedCount || 0,
          tags: record.content?.tags || [],
        } as PlaceCollectionItem;

        console.debug("Created place collection item:", result);
        return result;
      }

      case "place_update": {
        const place = await safeGetCityById(record.place, getCityById);
        if (!place) return null;
        return {
          ...baseItem,
          type: "place_update",
          place,
          updateType:
            (record.content?.updateType as "new_photos") || "new_photos",
          content: {
            title: record.content?.title || "",
            description: record.content?.description || "",
            images: record.content?.images || [],
          },
        } as PlaceUpdateItem;
      }

      case "similar_places": {
        const placeIds = getPlaceIds(record.places);
        const [basedOn, ...similarPlaces] = await Promise.all([
          safeGetCityById(record.place, getCityById),
          ...placeIds.map((id) => safeGetCityById(id, getCityById)),
        ]);
        if (!basedOn || !similarPlaces.length) return null;
        return {
          ...baseItem,
          type: "similar_places",
          basedOn,
          similarPlaces: similarPlaces.filter(Boolean),
          matchingTags: record.content?.matchingTags || [],
        } as SimilarPlacesItem;
      }

      case "tag_spotlight": {
        const placeIds = getPlaceIds(record.places);
        const featuredPlaces = await Promise.all(
          placeIds.map((id) => safeGetCityById(id, getCityById))
        );
        const validPlaces = featuredPlaces.filter(Boolean);
        if (!validPlaces.length) return null;
        return {
          ...baseItem,
          type: "tag_spotlight",
          tag: record.source_name,
          description: record.content?.description || "",
          featuredPlaces: validPlaces,
          stats: {
            totalPlaces: record.stats?.totalPlaces || 0,
            recentActivity: record.stats?.recentActivity || 0,
          },
        } as TagSpotlightItem;
      }

      default:
        console.warn(`Unknown feed item type: ${record.type}`);
        return null;
    }
  } catch (error) {
    console.error("Error transforming feed item:", error, record);
    return null;
  }
}
