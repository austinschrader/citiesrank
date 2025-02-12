// src/features/feed/components/TagSpotlightItem.tsx
/**
 * Renders a tag spotlight item with related tags and places.
 * Includes follow/unfollow functionality for tags.
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { TagSpotlightItem as TagSpotlightItemType } from "../types";
import { getPlaceImageBySlug } from "@/lib/bunny";

interface TagSpotlightItemProps {
  item: TagSpotlightItemType;
  followedTags: string[];
  followTag: (tag: string) => void;
  unfollowTag: (tag: string) => void;
}

const TagSpotlightItem = ({
  item,
  followedTags,
  followTag,
  unfollowTag,
}: TagSpotlightItemProps) => (
  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Tag className="w-6 h-6 text-indigo-500 mr-2" />
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              #{item.tag} Spotlight
            </h3>
            <p className="text-sm text-gray-600">
              {item.stats.totalPlaces} places • {item.stats.recentActivity} recent activities
            </p>
          </div>
        </div>
        <Button
          variant={followedTags.includes(item.tag) ? "secondary" : "default"}
          size="sm"
          className="gap-2"
          onClick={() =>
            followedTags.includes(item.tag)
              ? unfollowTag(item.tag)
              : followTag(item.tag)
          }
        >
          <Heart className="h-4 w-4" />
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
              className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
          </Link>
        ))}
      </div>
    </div>
  </Card>
);

export default TagSpotlightItem;
