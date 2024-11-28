import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCityImage } from "@/lib/cloudinary";
import { CitiesResponse } from "@/pocketbase-types";

interface PlaceCardProps {
  place: CitiesResponse;
  isActive: boolean;
  onClick: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isActive,
  onClick,
}) => {
  const coverImage =
    getCityImage(place.imageUrl, "thumbnail") || "/placeholder.jpg";

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isActive ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="w-48 h-40 relative overflow-hidden">
            <img
              src={coverImage}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 py-4 pr-4">
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-xl font-semibold">{place.name}</h3>
              {place.averageRating && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">
                    {place.averageRating.toFixed(1)}
                  </span>
                  {place.totalReviews > 0 && (
                    <span className="text-muted-foreground">
                      ({place.totalReviews})
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-muted-foreground mb-3">{place.country}</p>
            <p className="text-sm line-clamp-2 mb-3">{place.description}</p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(place.destinationTypes) &&
                place.destinationTypes.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
