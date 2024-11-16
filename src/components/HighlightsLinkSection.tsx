import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../config/categories";
import type { HighlightLinkProps, HighlightLinkSectionProps } from "@/types";

const MAX_VISIBLE_HIGHLIGHTS = 3;

const getHighlightType = (text: string) => {
  const lowercase = text.toLowerCase();

  // Historical Sites
  if (lowercase.includes("castle") || lowercase.includes("bridge") || lowercase.includes("tower") || lowercase.includes("monument")) {
    return CATEGORIES.historic;
  }

  // Architecture & Districts
  if (lowercase.includes("district") || lowercase.includes("square") || lowercase.includes("cathedral") || lowercase.includes("basilica")) {
    return CATEGORIES.architecture;
  }

  // Natural Spaces
  if (lowercase.includes("park") || lowercase.includes("garden") || lowercase.includes("nature") || lowercase.includes("way")) {
    return CATEGORIES.nature;
  }

  // Food and Drink
  if (lowercase.includes("market") || lowercase.includes("restaurant") || lowercase.includes("wine") || lowercase.includes("food")) {
    return CATEGORIES.dining;
  }

  // Cultural Venues (default)
  return CATEGORIES.cultural;
};

const generateHighlightUrl = (highlight: string, cityName: string, country: string): string => {
  const slugifiedHighlight = highlight.toLowerCase().replace(/\s+/g, "-");
  const slugifiedCity = cityName.toLowerCase().replace(/\s+/g, "-");
  const slugifiedCountry = country.toLowerCase().replace(/\s+/g, "-");
  const { type } = getHighlightType(highlight);

  return `/${slugifiedCountry}/${slugifiedCity}/${type}/${slugifiedHighlight}`;
};

const HighlightLink: React.FC<HighlightLinkProps> = ({ highlight, cityName, country, onClick, hasImages }) => {
  const highlightInfo = getHighlightType(highlight);

  return (
    <a
      href={generateHighlightUrl(highlight, cityName, country)}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full transition-all text-sm group",
        "hover:scale-105 active:scale-100",
        highlightInfo.className,
        hasImages ? "cursor-pointer" : "cursor-default"
      )}
      aria-label={`Learn more about ${highlight} in ${cityName}, ${country}`}>
      {highlightInfo.icon}
      <span>{highlight}</span>
      {/* {hasImages && <span className="w-2 h-2 bg-current opacity-50 group-hover:opacity-100 transition-opacity rounded-full ml-1" />} */}
      {hasImages && <CameraIcon className="w-4 h-4 text-current opacity-50 group-hover:opacity-100 transition-opacity ml-1" />}
    </a>
  );
};

export const HighlightLinkSection: React.FC<HighlightLinkSectionProps> = ({ highlights, cityName, country, onHighlightClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreHighlights = highlights.length > MAX_VISIBLE_HIGHLIGHTS;
  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, MAX_VISIBLE_HIGHLIGHTS);
  const [highlightsWithImages, setHighlightsWithImages] = useState<{ highlight: string; hasImages: boolean }[]>([]);

  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const citySlug = createSlug(cityName);

  useEffect(() => {
    const checkImages = async () => {
      const updatedHighlights = await Promise.all(
        visibleHighlights.map(async (highlight) => {
          const attractionSlug = createSlug(highlight);
          const imageUrl = `/images/attractions/${citySlug}/${attractionSlug}-400.jpg`;
          const hasImages = await checkImageExists(imageUrl);
          return { highlight, hasImages };
        })
      );
      setHighlightsWithImages(updatedHighlights);
    };

    checkImages();
  }, [visibleHighlights, citySlug]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {highlightsWithImages.map(({ highlight, hasImages }, index) => (
          <HighlightLink
            key={index}
            highlight={highlight}
            cityName={cityName}
            country={country}
            onClick={onHighlightClick}
            hasImages={hasImages}
          />
        ))}
      </div>

      {hasMoreHighlights && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground text-sm h-8"
          onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show {highlights.length - MAX_VISIBLE_HIGHLIGHTS} more
            </>
          )}
        </Button>
      )}
    </div>
  );
};
