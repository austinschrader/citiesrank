// src/features/feed/components/PlaceCollectionItem.tsx
/**
 * Renders a place collection item with a list of places and tags.
 * Includes follow/unfollow functionality for tags.
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { PlaceCollectionItem as PlaceCollectionItemType } from "../types";
import { getPlaceImageBySlug } from "@/lib/bunny";

interface PlaceCollectionItemProps {
  item: PlaceCollectionItemType;
  followedTags: string[];
  followTag: (tag: string) => void;
  unfollowTag: (tag: string) => void;
}

const PlaceCollectionItem = ({
  item,
  followedTags,
  followTag,
  unfollowTag,
}: PlaceCollectionItemProps) => (
  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 w-full">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {item.title}
        </h3>
      </div>
      <p className="text-gray-600 mb-4">{item.description}</p>
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
              className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
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
    </div>
  </Card>
);

export default PlaceCollectionItem;
