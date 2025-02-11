// src/features/feed/pages/FeedPage.tsx
/**
 * Renders the personalized feed UI, displaying various types of feed items in a card-based layout.
 * Utilizes FeedContext for managing feed content and interactions like follow/unfollow.
 * Incorporates shadcn/ui components for styling and handles loading/empty states.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPlaceImageBySlug } from "@/lib/bunny";
import "@/lib/styles/index.css";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Heart,
  MapPin,
  Sparkles,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import EmptyFeedState from "../components/EmptyFeedState";
import FeedHeader from "../components/FeedHeader";
import LoadingState from "../components/LoadingState";
import PlaceCollectionItem from '../components/PlaceCollectionItem';
import TrendingPlaceItem from "../components/TrendingPlaceItem";
import { useFeed } from "../context/FeedContext";

import {
  FeedItem,
  FriendActivityItem,
  PhotoChallengeItem,
  PlaceCollectionItem as PlaceCollectionItemType,
  PlaceUpdateItem,
  SimilarPlacesItem,
  TagSpotlightItem,
  TimeMachineItem,
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
        const similarItem = item as SimilarPlacesItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Similar to {similarItem.basedOn?.name || "this place"}
                </h3>
              </div>
              {similarItem.similarPlaces.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {similarItem.similarPlaces.map((place) => (
                    <div key={place.id} className="relative group">
                      <img
                        src={getPlaceImageBySlug(
                          place.imageUrl.replace(/-1$/, ""),
                          1,
                          "thumbnail"
                        )}
                        alt={place.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">
                          {place.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No similar places found</p>
              )}
              {similarItem.matchingTags &&
                similarItem.matchingTags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Matching tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {similarItem.matchingTags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </Card>
        );
      }
      case "place_update": {
        const updateItem = item as PlaceUpdateItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {updateItem.content.title}
                  </h3>
                </div>
                <Button
                  variant={
                    followedPlaces.includes(updateItem.place.id)
                      ? "secondary"
                      : "default"
                  }
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    followedPlaces.includes(updateItem.place.id)
                      ? unfollowPlace(updateItem.place.id)
                      : followPlace(updateItem.place.id)
                  }
                >
                  <Heart className="h-4 w-4" />
                  {followedPlaces.includes(updateItem.place.id)
                    ? "Following"
                    : "Follow"}
                </Button>
              </div>
              <p className="text-gray-600 mb-3">
                {updateItem.content.description}
              </p>
              {updateItem.content.images && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {updateItem.content.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={getPlaceImageBySlug(
                        image.replace(/-1$/, ""),
                        1,
                        "thumbnail"
                      )}
                      alt={`Update from ${updateItem.place.name}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      }
      case "tag_spotlight": {
        const spotlightItem = item as TagSpotlightItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Tag className="w-6 h-6 text-indigo-500 mr-2" />
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      #{spotlightItem.tag} Spotlight
                    </h3>
                    <p className="text-sm text-gray-600">
                      {spotlightItem.stats.totalPlaces} places •{" "}
                      {spotlightItem.stats.recentActivity} recent activities
                    </p>
                  </div>
                </div>
                <Button
                  variant={
                    followedTags.includes(spotlightItem.tag)
                      ? "secondary"
                      : "default"
                  }
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    followedTags.includes(spotlightItem.tag)
                      ? unfollowTag(spotlightItem.tag)
                      : followTag(spotlightItem.tag)
                  }
                >
                  <Heart className="h-4 w-4" />
                  {followedTags.includes(spotlightItem.tag)
                    ? "Following"
                    : "Follow"}
                </Button>
              </div>
              <p className="text-gray-600 mb-3">{spotlightItem.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {spotlightItem.featuredPlaces.slice(0, 3).map((place) => (
                  <Link key={place.id} to={`/places/${place.id}`}>
                    <img
                      src={getPlaceImageBySlug(
                        place.imageUrl.replace(/-1$/, ""),
                        1,
                        "thumbnail"
                      )}
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        );
      }
      case "photo_challenge": {
        const challengeItem = item as PhotoChallengeItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Camera className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {challengeItem.title}
                </h3>
              </div>
              <p className="text-gray-600 mb-3">{challengeItem.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {challengeItem.topPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={getPlaceImageBySlug(
                      photo.replace(/-1$/, ""),
                      1,
                      "thumbnail"
                    )}
                    alt={`Challenge photo ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600">
                  <Users className="w-4 h-4 inline mr-1" />
                  {challengeItem.participants} participating
                </span>
                <span className="text-pink-600">
                  {challengeItem.daysLeft} days left
                </span>
              </div>
              {challengeItem.prize && (
                <div className="mt-2 text-sm text-purple-600">
                  <Trophy className="w-4 h-4 inline mr-1" />
                  Prize: {challengeItem.prize}
                </div>
              )}
            </div>
          </Card>
        );
      }
      case "friend_activity": {
        const friendItem = item as FriendActivityItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {friendItem.users.map((user, idx) => (
                    <img
                      key={user.id}
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold">
                    {friendItem.users[0].name}
                  </span>{" "}
                  and {friendItem.users.length - 1} others{" "}
                  {friendItem.activityType}
                </p>
              </div>
              <div className="relative">
                <img
                  src={getPlaceImageBySlug(
                    friendItem.sight.image.replace(/-1$/, ""),
                    1,
                    "thumbnail"
                  )}
                  alt={friendItem.sight.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {friendItem.sight.name} • {friendItem.sight.location}
                </div>
              </div>
            </div>
          </Card>
        );
      }
      case "time_machine": {
        const timeItem = item as TimeMachineItem;
        return (
          <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
            <div className="p-6 relative">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-indigo-500 mr-2" />
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {timeItem.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {timeItem.yearsAgo} year{timeItem.yearsAgo > 1 ? "s" : ""}{" "}
                    ago
                  </p>
                </div>
              </div>
              <img
                src={getPlaceImageBySlug(
                  timeItem.memory.image.replace(/-1$/, ""),
                  1,
                  "wide"
                )}
                alt={timeItem.memory.title}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              <div className="flex justify-between items-center">
                <p className="font-semibold">{timeItem.memory.title}</p>
                <div className="text-sm text-gray-500">
                  <Heart className="w-4 h-4 inline mr-1" />
                  {timeItem.memory.likes} loves
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {timeItem.memory.placeName}
              </p>
            </div>
          </Card>
        );
      }
      default:
        return null;
    }
  }
};
