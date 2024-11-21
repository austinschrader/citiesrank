import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCityImage } from "@/lib/cloudinary";

// Local interface for this component's needs
interface ViewListPlace {
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  tags: string[];
}

interface PlaceCardProps {
  place: ViewListPlace;
  isActive: boolean;
  onClick: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, isActive, onClick }) => (
  <Card className={`cursor-pointer transition-all hover:shadow-md ${isActive ? "ring-2 ring-primary" : ""}`} onClick={onClick}>
    <CardContent className="p-0">
      <div className="flex gap-4">
        <div className="w-48 h-40 relative overflow-hidden">
          <img
            src={getCityImage(place.imageUrl || `${place.name}-${place.country}`, "thumbnail")}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 py-4 pr-4">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-semibold">{place.name}</h3>
            {place.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{place.rating}</span>
                {place.reviews && <span className="text-muted-foreground">({place.reviews})</span>}
              </div>
            )}
          </div>
          <p className="text-muted-foreground mb-3">{place.country}</p>
          <p className="text-sm line-clamp-2 mb-3">{place.description}</p>
          <div className="flex flex-wrap gap-2">
            {place.tags?.map((tag) => (
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
