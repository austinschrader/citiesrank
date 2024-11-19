import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { CityCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { HighlightLinkSection } from "@/components/HighlightsLinkSection";
import { ImageGallery } from "@/components/ImageGallery";

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [, setActiveHighlight] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const handleCityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Replace with your routing implementation
    console.log("Would navigate to:", `/${countrySlug}/${citySlug}`);
  };

  const handleCountryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the city click
    // TODO: Replace with your routing implementation
    console.log("Would navigate to:", `/${countrySlug}`);
  };

  const handleHighlightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const highlightName = (e.currentTarget as HTMLAnchorElement).textContent;
    setActiveHighlight(highlightName);
  };

  const citySlug = city.name.toLowerCase().replace(/\s+/g, "-");
  const countrySlug = city.country.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <ImageGallery cityName={city.name} country={city.country} />

        <div className="absolute top-4 left-4 z-20">
          <div
            className={cn(
              "px-4 py-2 rounded-full text-base font-medium",
              "shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
              getMatchColor(city.matchScore)
            )}>
            {Math.round(city.matchScore)}% match
          </div>
        </div>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all hover:scale-110 active:scale-95 z-20 shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}>
          <Star className={cn("w-6 h-6", isFavorite && "fill-primary text-primary")} />
        </button>
      </div>

      <div className="pt-5 pb-2 px-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <a
              href={`/${countrySlug}/${citySlug}`}
              className="font-semibold text-xl text-foreground hover:opacity-70 active:opacity-50 transition-opacity"
              onClick={handleCityClick}>
              {city.name},
            </a>
            <a
              href={`/${countrySlug}`}
              className="text-lg text-muted-foreground hover:text-primary/80 transition-colors"
              onClick={handleCountryClick}>
              {city.country}
            </a>
          </div>
          {city.reviews && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{city.reviews.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-base text-muted-foreground mb-3">
          <MapPin className="w-5 h-5 shrink-0" />
          <span>{city.population} residents</span>
        </div>

        <p className="text-base text-muted-foreground mb-4 line-clamp-2">{city.description}</p>

        <HighlightLinkSection
          highlights={city.highlights}
          cityName={city.name}
          country={city.country}
          onHighlightClick={handleHighlightClick}
        />
      </div>
    </Card>
  );
};
