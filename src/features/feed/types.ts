/**
 * Defines the type system for the feed feature, including different types of feed items (trending places, updates, spotlights).
 * Each feed item type extends the base FeedItem interface and includes specific fields for that content type.
 * Used by FeedContext and FeedView to ensure type safety and consistent data structure across the feed feature.
 */

import { CitiesResponse as City } from "@/lib/types/pocketbase-types";
import { PlaceTag } from "@/features/places/types/tags";

export type FeedItemType =
  | 'trending_place'
  | 'place_collection'
  | 'similar_places'
  | 'place_update'
  | 'tag_spotlight'
  | 'photo_challenge'
  | 'friend_activity'
  | 'time_machine';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  timestamp: string;
  source: {
    type: 'tag' | 'place' | 'system' | 'user';
    name: string;
  };
}

export interface PocketBaseRecord {
  id: string;
  type: FeedItemType;
  timestamp: string;
  source_type: string;
  source_name: string;
  content?: {
    title?: string;
    description?: string;
    updateType?: string;
    images?: string[];
    tags?: string[];
    matchingTags?: string[];
  };
  stats?: {
    recentReviews?: number;
    recentPhotos?: number;
    activeUsers?: number;
    trendingTags?: string[];
    savedCount?: number;
    contributionCount?: number;
    expertise?: string;
    totalPlaces?: number;
    recentActivity?: number;
  };
  place?: string;
  places?: string[];
  curator?: string;
}

export interface TrendingPlaceItem extends FeedItem {
  type: 'trending_place';
  place: City;
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
  places: City[];
  curator: {
    name: string;
    avatar: string;
    contributionCount?: number;
    expertise?: string;
  };
  savedCount: number;
  tags: string[];
}

export interface SimilarPlacesItem extends FeedItem {
  type: 'similar_places';
  basedOn: City;
  similarPlaces: City[];
  matchingTags: string[];
}

export interface PlaceUpdateItem extends FeedItem {
  type: 'place_update';
  place: City;
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
  featuredPlaces: City[];
  stats: {
    totalPlaces: number;
    recentActivity: number;
  };
}

export interface PhotoChallengeItem extends FeedItem {
  type: 'photo_challenge';
  title: string;
  description: string;
  participants: number;
  daysLeft: number;
  topPhotos: string[];
  prize?: string;
}

export interface FriendActivityItem extends FeedItem {
  type: 'friend_activity';
  users: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  sight: {
    id: string;
    name: string;
    image: string;
    location: string;
  };
  activityType: 'visited' | 'photographed' | 'reviewed';
}

export interface TimeMachineItem extends FeedItem {
  type: 'time_machine';
  title: string;
  memory: {
    title: string;
    image: string;
    likes: number;
    placeId: string;
    placeName: string;
  };
  yearsAgo: number;
}
