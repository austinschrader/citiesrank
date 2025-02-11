// src/features/feed/pages/FeedPage.tsx
/**
 * Renders the personalized feed UI, displaying various types of feed items in a card-based layout.
 * Utilizes FeedContext for managing feed content and interactions like follow/unfollow.
 * Incorporates shadcn/ui components for styling and handles loading/empty states.
 */

import { Card } from "@/components/ui/card";
import { getPlaceImageBySlug } from "@/lib/bunny";
import "@/lib/styles/index.css";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Heart, MapPin } from "lucide-react";
import EmptyFeedState from "../components/EmptyFeedState";
import FeedHeader from "../components/FeedHeader";
import FriendActivityItem from "../components/FriendActivityItem";
import LoadingState from "../components/LoadingState";
import PhotoChallengeItem from "../components/PhotoChallengeItem";
import PlaceCollectionItem from "../components/PlaceCollectionItem";
import PlaceUpdateItem from "../components/PlaceUpdateItem";
import SimilarPlacesItem from "../components/SimilarPlacesItem";
import TagSpotlightItem from "../components/TagSpotlightItem";
import TimeMachineItem from "../components/TimeMachineItem";
import TrendingPlaceItem from "../components/TrendingPlaceItem";
import { useFeed } from "../context/FeedContext";

import {
  FeedItem,
  FriendActivityItem as FriendActivityItemType,
  PhotoChallengeItem as PhotoChallengeItemType,
  PlaceCollectionItem as PlaceCollectionItemType,
  PlaceUpdateItem as PlaceUpdateItemType,
  SimilarPlacesItem as SimilarPlacesItemType,
  TagSpotlightItem as TagSpotlightItemType,
  TimeMachineItem as TimeMachineItemType,
  TrendingPlaceItem as TrendingPlaceItemType,
} from "../types";

export const FeedPage = () => {
  const {
    feedItems,
    isLoading,
    followTag,
    unfollowTag,
    followPlace,
    unfollowPlace,
    followedTags,
    followedPlaces,
  } = useFeed();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!feedItems.length) {
    return <EmptyFeedState />;
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="w-full max-w-4xl mx-auto px-4 py-6 pt-12 pb-24"
      >
        {/* Header Section */}
        <FeedHeader itemVariants={itemVariants} />

        {/* Feed Items */}
        <AnimatePresence>
          <motion.div variants={containerVariants} className="space-y-6">
            {feedItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="w-full"
              >
                {renderFeedItem(item)}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );

  function renderFeedItem(item: FeedItem) {
    if (!item) return null;

    switch (item.type) {
      case "trending_place": {
        return (
          <TrendingPlaceItem
            item={item as TrendingPlaceItemType}
            followedPlaces={followedPlaces}
            followPlace={followPlace}
            unfollowPlace={unfollowPlace}
          />
        );
      }
      case "place_collection": {
        return (
          <PlaceCollectionItem
            item={item as PlaceCollectionItemType}
            followedTags={followedTags}
            followTag={followTag}
            unfollowTag={unfollowTag}
          />
        );
      }
      case "similar_places": {
        return <SimilarPlacesItem item={item as SimilarPlacesItemType} />;
      }
      case "place_update": {
        return (
          <PlaceUpdateItem
            item={item as PlaceUpdateItemType}
            followedPlaces={followedPlaces}
            followPlace={followPlace}
            unfollowPlace={unfollowPlace}
          />
        );
      }
      case "tag_spotlight": {
        return (
          <TagSpotlightItem
            item={item as TagSpotlightItemType}
            followedTags={followedTags}
            followTag={followTag}
            unfollowTag={unfollowTag}
          />
        );
      }
      case "photo_challenge": {
        return <PhotoChallengeItem item={item as PhotoChallengeItemType} />;
      }
      case "friend_activity": {
        return <FriendActivityItem item={item as FriendActivityItemType} />;
      }
      case "time_machine": {
        return <TimeMachineItem item={item as TimeMachineItemType} />;
      }
      default:
        return null;
    }
  }
};
