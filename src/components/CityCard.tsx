import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { CityCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";
import { useNavigate } from "react-router-dom";

// Add this utility function at the top
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the favorite button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    const citySlug = createSlug(city.name);
    const countrySlug = createSlug(city.country);
    navigate(`/cities/${countrySlug}/${citySlug}`, {
      state: { cityData: city },
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setIsFavorite(!isFavorite);
    // Add your favorite logic here
  };

  return (
    <Card
      id={`city-${createSlug(city.name)}`}
      className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3]">
        <ImageGallery
          cityName={city.name}
          country={city.country}
          showControls={showControls}
        />

        <div className="absolute top-2 left-2 z-20">
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              "shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
              getMatchColor(city.matchScore)
            )}
          >
            {Math.round(city.matchScore)}% match
          </div>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all hover:scale-110 active:scale-95 z-20 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
          aria-label={
            isFavorite ? "Remove from favorites" : "Save to favorites"
          }
        >
          <Star
            className={cn("w-4 h-4", isFavorite && "fill-primary text-primary")}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {city.name}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {city.country}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-3">
              {city.description}
            </p>
          </div>

          {city.reviews && (
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground mb-1">
                {city.reviews.averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {city.reviews.totalReviews} reviews
              </div>
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
