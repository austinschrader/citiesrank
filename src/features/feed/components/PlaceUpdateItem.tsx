// src/features/feed/components/PlaceUpdateItem.tsx
/**
 * Renders a place update item with images and follow/unfollow functionality.
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart } from "lucide-react";
import { PlaceUpdateItem as PlaceUpdateItemType } from "../types";
import { getPlaceImageBySlug } from "@/lib/bunny";

interface PlaceUpdateItemProps {
  item: PlaceUpdateItemType;
  followedPlaces: string[];
  followPlace: (placeId: string) => void;
  unfollowPlace: (placeId: string) => void;
}

const PlaceUpdateItem = ({
  item,
  followedPlaces,
  followPlace,
  unfollowPlace,
}: PlaceUpdateItemProps) => (
  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <MapPin className="w-6 h-6 text-blue-500 mr-2" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {item.content.title}
          </h3>
        </div>
        <Button
          variant={
            followedPlaces.includes(item.place.id) ? "secondary" : "default"
          }
          size="sm"
          className="gap-2"
          onClick={() =>
            followedPlaces.includes(item.place.id)
              ? unfollowPlace(item.place.id)
              : followPlace(item.place.id)
          }
        >
          <Heart className="h-4 w-4" />
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
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  </Card>
);

export default PlaceUpdateItem;
