import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { CityCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { HighlightLinkSection } from "@/components/HighlightsLinkSection";
import { ImageGallery } from "@/components/ImageGallery";

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const handleHighlightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const highlightName = (e.currentTarget as HTMLAnchorElement).textContent;
    setActiveHighlight(highlightName);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
      <ImageGallery
        cityName={city.name}
        country={city.country}
        highlights={city.highlights}
        currentHighlight={activeHighlight}
        onHighlightChange={setActiveHighlight}
      />

      <div className="absolute top-4 left-4 z-10">
        <div className={cn("px-4 py-2 rounded-full text-base font-medium shadow-sm", getMatchColor(city.matchScore))}>
          {Math.round(city.matchScore)}% match
        </div>
      </div>

      <button
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white transition-colors hover:scale-110 active:scale-95 z-10"
        aria-label="Save to favorites">
        <Star className="w-6 h-6" />
      </button>

      <div className="pt-5 pb-2 px-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <h2 className="font-semibold text-xl text-foreground">
              {city.name}
              <span className="text-muted-foreground">, </span>
              <span className="text-lg text-muted-foreground">{city.country}</span>
            </h2>
          </div>
          {city.reviews && (
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-primary text-primary" />
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
