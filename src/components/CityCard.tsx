import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { CityCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const citySlug = city.name.toLowerCase().replace(/\s+/g, "-");
  const countrySlug = city.country.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card
      className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <div className="relative aspect-[4/3]">
        <ImageGallery
          cityName={city.name}
          country={city.country}
          showControls={showControls} // Pass show controls state
        />

        <div className="absolute top-2 left-2 z-20">
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              "shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
              getMatchColor(city.matchScore)
            )}>
            {Math.round(city.matchScore)}% match
          </div>
        </div>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all hover:scale-110 active:scale-95 z-20 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}>
          <Star className={cn("w-4 h-4", isFavorite && "fill-primary text-primary")} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <a
                href={`/${countrySlug}/${citySlug}`}
                className="text-lg font-medium text-foreground hover:text-primary/90 transition-colors">
                {city.name}
              </a>
              <a href={`/${countrySlug}`} className="text-sm font-medium text-muted-foreground hover:text-primary/80 transition-colors">
                {city.country}
              </a>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-3">{city.description}</p>
          </div>

          {city.reviews && (
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground mb-1">{city.reviews.averageRating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">{city.reviews.totalReviews} reviews</div>
            </div>
          )}
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0 mr-1" />
          <span>{city.population} residents</span>
        </div>
      </div>
    </Card>
  );
};

export default CityCard;
