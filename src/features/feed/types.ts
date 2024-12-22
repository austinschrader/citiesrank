/**
 * Defines the type system for the feed feature, including different types of feed items (trending places, updates, spotlights).
 * Each feed item type extends the base FeedItem interface and includes specific fields for that content type.
 * Used by FeedContext and FeedView to ensure type safety and consistent data structure across the feed feature.
 */

import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { PlaceTag } from "@/features/places/types/tags";

export type FeedItemType =
  | 'trending_place'
  | 'place_collection'
  | 'similar_places'
  | 'place_update'
  | 'tag_spotlight';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  timestamp: string;
  source: {
    type: 'tag' | 'place' | 'system';
    name: string;
  };
}

export interface TrendingPlaceItem extends FeedItem {
  type: 'trending_place';
  place: CitiesResponse;
  stats: {
    recentReviews: number;
    recentPhotos: number;
    activeUsers: number;
  };
  trendingTags: string[];
}

export interface PlaceCollectionItem extends FeedItem {
  type: 'place_collection';
  title: string;
  description: string;
  places: CitiesResponse[];
  curator: {
    name: string;
    avatar: string;
  };
  savedCount: number;
  tags: string[];
}

export interface SimilarPlacesItem extends FeedItem {
  type: 'similar_places';
  basedOn: CitiesResponse;
  similarPlaces: CitiesResponse[];
  matchingTags: string[];
}

export interface PlaceUpdateItem extends FeedItem {
  type: 'place_update';
  place: CitiesResponse;
  updateType: 'new_photos' | 'new_reviews' | 'seasonal_update';
  content: {
    title: string;
    description: string;
    images?: string[];
  };
}

export interface TagSpotlightItem extends FeedItem {
  type: 'tag_spotlight';
  tag: string;
  description: string;
  featuredPlaces: CitiesResponse[];
  stats: {
    totalPlaces: number;
    recentActivity: number;
  };
}
