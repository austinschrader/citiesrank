// src/features/feed/components/SimilarPlacesItem.tsx
/**
 * Renders a similar places item with a list of similar places.
 * Displays matching tags if available.
 */

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPlaceImageBySlug } from "@/lib/bunny";
import { Sparkles } from "lucide-react";
import { SimilarPlacesItem as SimilarPlacesItemType } from "../types";

interface SimilarPlacesItemProps {
  item: SimilarPlacesItemType;
}

const SimilarPlacesItem = ({ item }: SimilarPlacesItemProps) => (
  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
    <div className="p-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
    </div>
  </Card>
);

export default SimilarPlacesItem;
