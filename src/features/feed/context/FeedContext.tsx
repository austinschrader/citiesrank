/**
 * Manages the state and logic for the personalized feed system, including followed tags and places.
 * Integrates with AuthContext to handle user authentication and PocketBase operations for feed content.
 * Provides methods to follow/unfollow content and refresh the feed, used by FeedView for display.
 */

import { getApiUrl } from "@/config/appConfig";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useCities,
  useCitiesActions,
} from "@/features/places/context/CitiesContext";
import PocketBase from "pocketbase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { transformFeedItem } from "../transformers";
import { FeedItem, PocketBaseRecord } from "../types";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

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
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { cities } = useCities();
  const { getCityById } = useCitiesActions();
  const [followedPlaces, setFollowedPlaces] = useState<string[]>([]);
  const [followedTags, setFollowedTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  useEffect(() => {
    if (followedPlaces.length > 0 || followedTags.length > 0) {
      refreshFeed();
    }
  }, [followedPlaces, followedTags]);

  const loadUserPreferences = async () => {
    if (!user) {
      console.debug("No user found, skipping preferences load");
      return;
    }

    try {
      console.debug("Loading user preferences for:", user.id);
      const result = await pb.collection("user_preferences").getList(1, 1, {
        filter: `user="${user.id}"`,
        $autoCancel: false,
      });

      if (result.items.length > 0) {
        const record = result.items[0];
        console.debug("User preferences loaded:", {
          followedTags: record.followed_tags,
          followedPlaces: record.followed_places,
        });
        setFollowedTags(record.followed_tags || []);
        setFollowedPlaces(record.followed_places || []);
      } else {
        console.debug("No preferences found, creating default");
        await pb.collection("user_preferences").create(
          {
            user: user.id,
            followed_tags: [],
            followed_places: [],
          },
          {
            $autoCancel: false,
          }
        );
        setFollowedTags([]);
        setFollowedPlaces([]);
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
      // Set defaults on error
      setFollowedTags([]);
      setFollowedPlaces([]);
    }
  };

  const updateUserPreferences = async (
    newTags?: string[],
    newPlaces?: string[]
  ) => {
    if (!user) return;

    const tagsToUpdate = newTags ?? followedTags;
    const placesToUpdate = newPlaces ?? followedPlaces;

    try {
      const result = await pb.collection("user_preferences").getList(1, 1, {
        filter: `user="${user.id}"`,
        $autoCancel: false,
      });

      if (result.items.length > 0) {
        const record = result.items[0];
        await pb.collection("user_preferences").update(
          record.id,
          {
            followed_tags: tagsToUpdate,
            followed_places: placesToUpdate,
          },
          {
            $autoCancel: false,
          }
        );
      } else {
        await pb.collection("user_preferences").create(
          {
            user: user.id,
            followed_tags: tagsToUpdate,
            followed_places: placesToUpdate,
          },
          {
            $autoCancel: false,
          }
        );
      }
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  };

  const followTag = async (tag: string) => {
    if (followedTags.includes(tag)) return;
    const newTags = [...followedTags, tag];
    await updateUserPreferences(newTags, followedPlaces);
    setFollowedTags(newTags);
  };

  const unfollowTag = async (tag: string) => {
    const newTags = followedTags.filter((t) => t !== tag);
    await updateUserPreferences(newTags, followedPlaces);
    setFollowedTags(newTags);
  };

  const followPlace = async (placeId: string) => {
    if (followedPlaces.includes(placeId)) return;
    const newPlaces = [...followedPlaces, placeId];
    await updateUserPreferences(followedTags, newPlaces);
    setFollowedPlaces(newPlaces);
  };

  const unfollowPlace = async (placeId: string) => {
    const newPlaces = followedPlaces.filter((p) => p !== placeId);
    await updateUserPreferences(followedTags, newPlaces);
    setFollowedPlaces(newPlaces);
  };

  const generateFeed = async () => {
    if (!user) {
      console.debug("No user found, returning empty feed");
      return [];
    }

    try {
      console.debug("Fetching feed items for user:", user.id);
      const result = await pb
        .collection("feed_items")
        .getList<PocketBaseRecord>(1, 50, {
          sort: "-created",
        });

      const items = await Promise.all(
        result.items.map((record) => transformFeedItem(record, getCityById))
      );

      const validItems = items.filter(
        (item): item is FeedItem => item !== null
      );
      console.debug("Final feed items count:", validItems.length);
      return validItems;
    } catch (error) {
      console.error("Error fetching feed items:", error);
      return [];
    }
  };

  const refreshFeed = async () => {
    setIsLoading(true);
    try {
      const items = await generateFeed();
      setFeedItems(items);
    } catch (error) {
      console.error("Error refreshing feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeedContext.Provider
      value={{
        feedItems,
        isLoading,
        followTag,
        unfollowTag,
        followPlace,
        unfollowPlace,
        followedTags,
        followedPlaces,
        refreshFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
