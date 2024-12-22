/**
 * Manages the state and logic for the personalized feed system, including followed tags and places.
 * Integrates with AuthContext to handle user authentication and PocketBase operations for feed content.
 * Provides methods to follow/unfollow content and refresh the feed, used by FeedView for display.
 */

import { useAuth } from "@/features/auth/hooks/useAuth";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  FeedItem,
  PlaceUpdateItem,
  TagSpotlightItem,
  TrendingPlaceItem,
} from "../types";

interface FeedContextType {
  feedItems: FeedItem[];
  isLoading: boolean;
  followTag: (tag: string) => Promise<void>;
  unfollowTag: (tag: string) => Promise<void>;
  followPlace: (placeId: string) => Promise<void>;
  unfollowPlace: (placeId: string) => Promise<void>;
  followedTags: string[];
  followedPlaces: string[];
  refreshFeed: () => Promise<void>;
}

const FeedContext = createContext<FeedContextType | null>(null);

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { pb, user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followedTags, setFollowedTags] = useState<string[]>([]);
  const [followedPlaces, setFollowedPlaces] = useState<string[]>([]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const record = await pb
        .collection("user_preferences")
        .getFirstListItem(`user="${user.id}"`);

      setFollowedTags(record.followed_tags || []);
      setFollowedPlaces(record.followed_places || []);
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }
  };

  const generateFeed = async () => {
    if (!user) return [];

    const items: FeedItem[] = [];

    // Get trending places from followed tags
    if (followedTags.length > 0) {
      const trendingPlaces = await pb.collection("cities").getList(1, 5, {
        filter: followedTags.map((tag) => `tags ~ "${tag}"`).join(" || "),
        sort: "-created",
      });

      trendingPlaces.items.forEach((place) => {
        items.push({
          id: `trending-${place.id}`,
          type: "trending_place",
          timestamp: new Date().toISOString(),
          source: { type: "tag", name: place.tags[0] },
          place: place as CitiesResponse,
          stats: {
            recentReviews: Math.floor(Math.random() * 20),
            recentPhotos: Math.floor(Math.random() * 30),
            activeUsers: Math.floor(Math.random() * 50),
          },
          trendingTags: place.tags.slice(0, 3),
        } as TrendingPlaceItem);
      });
    }

    // Get updates from followed places
    if (followedPlaces.length > 0) {
      const followedPlacesData = await pb.collection("cities").getList(1, 5, {
        filter: followedPlaces.map((id) => `id="${id}"`).join(" || "),
      });

      followedPlacesData.items.forEach((place) => {
        items.push({
          id: `update-${place.id}`,
          type: "place_update",
          timestamp: new Date().toISOString(),
          source: { type: "place", name: place.name },
          place: place as CitiesResponse,
          updateType: "new_photos",
          content: {
            title: `New photos from ${place.name}`,
            description: "Check out the latest photos from this city!",
            images: place.imageUrl ? [place.imageUrl] : [],
          },
        } as PlaceUpdateItem);
      });
    }

    // Add tag spotlights
    for (const tag of followedTags.slice(0, 2)) {
      const tagPlaces = await pb.collection("cities").getList(1, 3, {
        filter: `tags ~ "${tag}"`,
      });

      items.push({
        id: `tag-${tag}`,
        type: "tag_spotlight",
        timestamp: new Date().toISOString(),
        source: { type: "tag", name: tag },
        tag,
        description: `Explore places tagged with ${tag}`,
        featuredPlaces: tagPlaces.items as CitiesResponse[],
        stats: {
          totalPlaces: tagPlaces.totalItems,
          recentActivity: Math.floor(Math.random() * 100),
        },
      } as TagSpotlightItem);
    }

    return items.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const refreshFeed = async () => {
    setIsLoading(true);
    try {
      const items = await generateFeed();
      setFeedItems(items);
    } catch (error) {
      console.error("Error generating feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const followPlace = async (placeId: string) => {
    if (!user) return;

    try {
      let record;
      try {
        // Try to get existing preferences
        record = await pb
          .collection("user_preferences")
          .getFirstListItem(`user="${user.id}"`);
      } catch (error) {
        // If preferences don't exist, create them
        record = await pb.collection("user_preferences").create({
          user: user.id,
          followed_places: [],
          followed_tags: [],
        });
      }

      const updatedPlaces = [...new Set([...followedPlaces, placeId])];
      await pb.collection("user_preferences").update(record.id, {
        followed_places: updatedPlaces,
      });

      setFollowedPlaces(updatedPlaces);
      await refreshFeed();
    } catch (error) {
      console.error("Error following place:", error);
    }
  };

  const unfollowPlace = async (placeId: string) => {
    if (!user) return;

    try {
      const record = await pb
        .collection("user_preferences")
        .getFirstListItem(`user="${user.id}"`);

      const updatedPlaces = followedPlaces.filter((p) => p !== placeId);
      await pb.collection("user_preferences").update(record.id, {
        followed_places: updatedPlaces,
      });

      setFollowedPlaces(updatedPlaces);
      await refreshFeed();
    } catch (error) {
      console.error("Error unfollowing place:", error);
    }
  };

  const followTag = async (tag: string) => {
    if (!user) return;

    try {
      let record;
      try {
        // Try to get existing preferences
        record = await pb
          .collection("user_preferences")
          .getFirstListItem(`user="${user.id}"`);
      } catch (error) {
        // If preferences don't exist, create them
        record = await pb.collection("user_preferences").create({
          user: user.id,
          followed_places: [],
          followed_tags: [],
        });
      }

      const updatedTags = [...new Set([...followedTags, tag])];
      await pb.collection("user_preferences").update(record.id, {
        followed_tags: updatedTags,
      });

      setFollowedTags(updatedTags);
      await refreshFeed();
    } catch (error) {
      console.error("Error following tag:", error);
    }
  };

  const unfollowTag = async (tag: string) => {
    if (!user) return;

    try {
      const record = await pb
        .collection("user_preferences")
        .getFirstListItem(`user="${user.id}"`);

      const updatedTags = followedTags.filter((t) => t !== tag);
      await pb.collection("user_preferences").update(record.id, {
        followed_tags: updatedTags,
      });

      setFollowedTags(updatedTags);
      await refreshFeed();
    } catch (error) {
      console.error("Error unfollowing tag:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserPreferences().then(() => refreshFeed());
    }
  }, [user]);

  const value = {
    feedItems,
    isLoading,
    followTag,
    unfollowTag,
    followPlace,
    unfollowPlace,
    followedTags,
    followedPlaces,
    refreshFeed,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
