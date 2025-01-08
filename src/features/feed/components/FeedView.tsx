/**
 * Renders the personalized feed UI, displaying different types of feed items in a card-based layout.
 * Consumes FeedContext to display and interact with feed content, including following/unfollowing.
 * Uses shadcn/ui components for consistent styling and includes loading/empty states.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceImageBySlug } from "@/lib/bunny";
import {
  Calendar,
  Camera,
  Heart,
  MapPin,
  Settings,
  Sparkles,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFeed } from "../context/FeedContext";
import {
  FeedItem,
  FriendActivityItem,
  PhotoChallengeItem,
  PlaceCollectionItem,
  PlaceUpdateItem,
  SimilarPlacesItem,
  TagSpotlightItem,
  TimeMachineItem,
  TrendingPlaceItem,
} from "../types";

export const FeedView = () => {
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  const renderTrendingPlace = (item: TrendingPlaceItem) => (
    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
      <div className="flex items-center mb-3">
        <Sparkles className="w-6 h-6 text-orange-500 mr-2" />
        <h3 className="font-bold text-lg">{item.place.name} is Trending!</h3>
      </div>
      {item.place.imageUrl && (
        <img
          src={getPlaceImageBySlug(
            item.place.imageUrl.replace(/-1$/, ""),
            1,
            "thumbnail"
          )}
          alt={item.place.name}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
      )}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            <Camera className="w-4 h-4 inline mr-1" />
            {item.stats.recentPhotos} new photos
          </span>
          <span>
            <Users className="w-4 h-4 inline mr-1" />
            {item.stats.activeUsers} active
          </span>
        </div>
        <Button
          variant={
            followedPlaces.includes(item.place.id) ? "secondary" : "default"
          }
          size="sm"
          onClick={() =>
            followedPlaces.includes(item.place.id)
              ? unfollowPlace(item.place.id)
              : followPlace(item.place.id)
          }
        >
          {followedPlaces.includes(item.place.id) ? "Following" : "Follow"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.trendingTags.map((tag) => (
          <Badge
            key={tag}
            variant={followedTags.includes(tag) ? "secondary" : "default"}
            className="cursor-pointer"
            onClick={() =>
              followedTags.includes(tag) ? unfollowTag(tag) : followTag(tag)
            }
          >
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );

  const renderPlaceUpdate = (item: PlaceUpdateItem) => (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MapPin className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="font-bold text-lg">{item.content.title}</h3>
        </div>
        <Button
          variant={
            followedPlaces.includes(item.place.id) ? "secondary" : "default"
          }
          size="sm"
          onClick={() =>
            followedPlaces.includes(item.place.id)
              ? unfollowPlace(item.place.id)
              : followPlace(item.place.id)
          }
        >
          {followedPlaces.includes(item.place.id) ? "Following" : "Follow"}
        </Button>
      </div>
      <p className="text-gray-600 mb-3">{item.content.description}</p>
      {item.content.images && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {item.content.images.map((image, idx) => (
            <img
              key={idx}
              src={getPlaceImageBySlug(
                image.replace(/-1$/, ""),
                1,
                "thumbnail"
              )}
              alt={`Update from ${item.place.name}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </Card>
  );

  const renderPlaceCollection = (item: PlaceCollectionItem) => (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Heart className="w-6 h-6 text-purple-500 mr-2" />
          <div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">
              Curated by {item.curator.name}
            </p>
          </div>
        </div>
        <img
          src={item.curator.avatar}
          alt={item.curator.name}
          className="w-8 h-8 rounded-full"
        />
      </div>
      <p className="text-gray-600 mb-3">{item.description}</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {item.places.slice(0, 3).map((place) => (
          <Link key={place.id} to={`/places/${place.id}`}>
            <img
              src={getPlaceImageBySlug(
                place.imageUrl.replace(/-1$/, ""),
                1,
                "thumbnail"
              )}
              alt={place.name}
              className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant={followedTags.includes(tag) ? "secondary" : "default"}
              className="cursor-pointer"
              onClick={() =>
                followedTags.includes(tag) ? unfollowTag(tag) : followTag(tag)
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-sm text-gray-600">{item.savedCount} saves</span>
      </div>
    </Card>
  );

  const renderSimilarPlaces = (item: SimilarPlacesItem) => {
    console.debug("Rendering similar places:", {
      basedOn: item.basedOn,
      similarPlaces: item.similarPlaces,
    });

    if (!item.similarPlaces || !Array.isArray(item.similarPlaces)) {
      console.warn("Similar places is not an array:", item.similarPlaces);
      return null;
    }

    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center mb-3">
          <Sparkles className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="font-bold text-lg">
            Similar to {item.basedOn?.name || "this place"}
          </h3>
        </div>
        {item.similarPlaces.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {item.similarPlaces.map((place) => (
              <div key={place.id} className="relative group">
                <img
                  src={getPlaceImageBySlug(
                    place.imageUrl.replace(/-1$/, ""),
                    1,
                    "thumbnail"
                  )}
                  alt={place.name}
                  className="w-full h-24 object-cover rounded-lg"
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
        {item.matchingTags && item.matchingTags.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Matching tags:</p>
            <div className="flex flex-wrap gap-1">
              {item.matchingTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderTagSpotlight = (item: TagSpotlightItem) => (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Tag className="w-6 h-6 text-indigo-500 mr-2" />
          <div>
            <h3 className="font-bold text-lg">#{item.tag} Spotlight</h3>
            <p className="text-sm text-gray-600">
              {item.stats.totalPlaces} places • {item.stats.recentActivity}{" "}
              recent activities
            </p>
          </div>
        </div>
        <Button
          variant={followedTags.includes(item.tag) ? "secondary" : "default"}
          size="sm"
          onClick={() =>
            followedTags.includes(item.tag)
              ? unfollowTag(item.tag)
              : followTag(item.tag)
          }
        >
          {followedTags.includes(item.tag) ? "Following" : "Follow"}
        </Button>
      </div>
      <p className="text-gray-600 mb-3">{item.description}</p>
      <div className="grid grid-cols-3 gap-2">
        {item.featuredPlaces.slice(0, 3).map((place) => (
          <Link key={place.id} to={`/places/${place.id}`}>
            <img
              src={getPlaceImageBySlug(
                place.imageUrl.replace(/-1$/, ""),
                1,
                "thumbnail"
              )}
              alt={place.name}
              className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </Link>
        ))}
      </div>
    </Card>
  );

  const renderPhotoChallenge = (item: PhotoChallengeItem) => (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
      <div className="flex items-center mb-3">
        <Camera className="w-6 h-6 text-purple-500 mr-2" />
        <h3 className="font-bold text-lg">{item.title}</h3>
      </div>
      <p className="text-gray-600 mb-3">{item.description}</p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {item.topPhotos.map((photo, idx) => (
          <img
            key={idx}
            src={getPlaceImageBySlug(photo.replace(/-1$/, ""), 1, "thumbnail")}
            alt={`Challenge photo ${idx + 1}`}
            className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-purple-600">
          <Users className="w-4 h-4 inline mr-1" />
          {item.participants} participating
        </span>
        <span className="text-pink-600">{item.daysLeft} days left</span>
      </div>
      {item.prize && (
        <div className="mt-2 text-sm text-purple-600">
          <Trophy className="w-4 h-4 inline mr-1" />
          Prize: {item.prize}
        </div>
      )}
    </Card>
  );

  const renderFriendActivity = (item: FriendActivityItem) => (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 p-4">
      <div className="flex items-center mb-3">
        <div className="flex -space-x-2">
          {item.users.map((user, idx) => (
            <img
              key={user.id}
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          ))}
        </div>
        <p className="ml-3 text-gray-600">
          <span className="font-semibold">{item.users[0].name}</span> and{" "}
          {item.users.length - 1} others {item.activityType}
        </p>
      </div>
      <div className="relative">
        <img
          src={getPlaceImageBySlug(
            item.sight.image.replace(/-1$/, ""),
            1,
            "thumbnail"
          )}
          alt={item.sight.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          <MapPin className="w-4 h-4 inline mr-1" />
          {item.sight.name} • {item.sight.location}
        </div>
      </div>
    </Card>
  );

  const renderTimeMachine = (item: TimeMachineItem) => (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
      <div className="flex items-center mb-3">
        <Calendar className="w-6 h-6 text-indigo-500 mr-2" />
        <div>
          <h3 className="font-bold text-lg">{item.title}</h3>
          <p className="text-sm text-gray-600">
            {item.yearsAgo} year{item.yearsAgo > 1 ? "s" : ""} ago
          </p>
        </div>
      </div>
      <img
        src={getPlaceImageBySlug(
          item.memory.image.replace(/-1$/, ""),
          1,
          "wide"
        )}
        alt={item.memory.title}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <div className="flex justify-between items-center">
        <p className="font-semibold">{item.memory.title}</p>
        <div className="text-sm text-gray-500">
          <Heart className="w-4 h-4 inline mr-1" />
          {item.memory.likes} loves
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        <MapPin className="w-4 h-4 inline mr-1" />
        {item.memory.placeName}
      </p>
    </Card>
  );

  const renderFeedItem = (item: FeedItem) => {
    if (!item) return null;

    switch (item.type) {
      case "trending_place":
        return renderTrendingPlace(item as TrendingPlaceItem);
      case "place_collection":
        return renderPlaceCollection(item as PlaceCollectionItem);
      case "similar_places":
        return renderSimilarPlaces(item as SimilarPlacesItem);
      case "place_update":
        return renderPlaceUpdate(item as PlaceUpdateItem);
      case "tag_spotlight":
        return renderTagSpotlight(item as TagSpotlightItem);
      default:
        return null;
    }
  };

  if (feedItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your feed is empty
          </h3>
          <p className="text-gray-600 mb-4">
            Follow some places or tags to start seeing updates!
          </p>
          <Link to="/explore">
            <Button>Explore Places</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <Link to="/following">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Following
          </Button>
        </Link>
      </div>

      {feedItems.length === 0 ? (
        <div className="max-w-2xl mx-auto p-4 text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your feed is empty
            </h3>
            <p className="text-gray-600 mb-4">
              Follow some places or tags to start seeing updates!
            </p>
            <Link to="/explore">
              <Button>Explore Places</Button>
            </Link>
          </div>
        </div>
      ) : (
        feedItems.map((item) => (
          <div key={item.id} className="mb-4">
            {renderFeedItem(item)}
          </div>
        ))
      )}
    </div>
  );
};
