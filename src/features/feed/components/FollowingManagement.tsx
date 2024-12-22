/**
 * Provides a centralized view to manage all followed places and tags.
 * Allows users to view and unfollow content without waiting for it to appear in their feed.
 * Integrated with FeedContext for state management and follow/unfollow actions.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCities } from "@/features/places/context/CitiesContext";
import { getImageUrl } from "@/lib/cloudinary";
import { Loader2, MapPin, Tag } from "lucide-react";
import { useMemo } from "react";
import { useFeed } from "../context/FeedContext";

export const FollowingManagement = () => {
  const { followedPlaces, followedTags, unfollowPlace, unfollowTag } =
    useFeed();
  const { cities, cityStatus } = useCities();

  // Filter followed places from the cities list
  const followedPlacesData = useMemo(() => {
    return cities.filter((city) => followedPlaces.includes(city.id));
  }, [cities, followedPlaces]);

  if (cityStatus.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Following Places</h2>
        </div>
        {followedPlacesData.length === 0 ? (
          <p className="text-gray-500">You're not following any places yet.</p>
        ) : (
          <div className="grid gap-4">
            {followedPlacesData.map((place) => (
              <div
                key={place.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {place.imageUrl && (
                    <img
                      src={getImageUrl(place.imageUrl, "thumbnail")}
                      alt={place.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-500">{place.type}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => unfollowPlace(place.id)}
                >
                  Unfollow
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Following Tags</h2>
        </div>
        {followedTags.length === 0 ? (
          <p className="text-gray-500">You're not following any tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {followedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => unfollowTag(tag)}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
