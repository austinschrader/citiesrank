import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

const HighlightLink: React.FC<HighlightLinkProps> = ({ highlight, cityName, country, onClick }) => {
  const highlightInfo = getHighlightType(highlight);

  return (
    <a
      href={generateHighlightUrl(highlight, cityName, country)}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full transition-all text-sm",
        "hover:scale-105 active:scale-100",
        highlightInfo.className
      )}
      aria-label={`Learn more about ${highlight} in ${cityName}, ${country}`}>
      {highlightInfo.icon}
      <span>{highlight}</span>
    </a>
  );
};

export const HighlightLinkSection: React.FC<HighlightLinkSectionProps> = ({ highlights, cityName, country, onHighlightClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreHighlights = highlights.length > MAX_VISIBLE_HIGHLIGHTS;
  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, MAX_VISIBLE_HIGHLIGHTS);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {visibleHighlights.map((highlight, index) => (
          <HighlightLink key={index} highlight={highlight} cityName={cityName} country={country} onClick={onHighlightClick} />
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
