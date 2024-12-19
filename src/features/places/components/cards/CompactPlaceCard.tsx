// src/features/places/components/cards/CompactPlaceCard.tsx
/**
 * Compact version of PlaceCard used in popups and tight spaces
 */
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getPlaceTypeInfo } from "@/features/places/utils/placeUtils";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { Heart } from "lucide-react";

interface CompactPlaceCardProps {
  city: CitiesResponse;
  onClick: (e: React.MouseEvent) => void;
}

export const CompactPlaceCard = ({ city, onClick }: CompactPlaceCardProps) => {
  const { user } = useAuth();
  const typeInfo = getPlaceTypeInfo([city.type]);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="cursor-pointer space-y-2" onClick={onClick}>
      <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden mb-3">
        <ImageGallery
          imageUrl={city.imageUrl}
          cityName={city.name}
          country={city.country}
          showControls={false}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">{city.name}</h3>
        </div>
        {user && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {city.description}
      </p>

      {/* {"matchScore" in city && typeof city.matchScore === "number" && (
        <Badge
          variant="secondary"
          className={cn("text-xs", getMatchColor(city.matchScore))}
        >
          {city.matchScore.toFixed(0)}% Match
        </Badge>
      )} */}
    </div>
  );
};
