// components/HighlightLink.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../config/categories";
import { HighlightLinkProps } from "@/types";

export const HighlightLink = ({ highlight, cityName, country, onClick }: HighlightLinkProps) => {
  const getHighlightType = (text: string) => {
    const lowercase = text.toLowerCase();

    // Historical Sites
    if (lowercase.includes("castle") || lowercase.includes("bridge") || lowercase.includes("tower") || lowercase.includes("monument")) {
      return CATEGORIES.historic;
    }

    // Architecture & Districts
    if (
      lowercase.includes("district") ||
      lowercase.includes("square") ||
      lowercase.includes("cathedral") ||
      lowercase.includes("basilica")
    ) {
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

  const generateUrl = (highlight: string): string => {
    const slugifiedHighlight = highlight.toLowerCase().replace(/\s+/g, "-");
    const slugifiedCity = cityName.toLowerCase().replace(/\s+/g, "-");
    const slugifiedCountry = country.toLowerCase().replace(/\s+/g, "-");
    const { type } = getHighlightType(highlight);

    return `/${slugifiedCountry}/${slugifiedCity}/${type}/${slugifiedHighlight}`;
  };

  const highlightInfo = getHighlightType(highlight);

  return (
    <a
      href={generateUrl(highlight)}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all",
        "hover:scale-105 active:scale-100",
        highlightInfo.className
      )}
      aria-label={`Learn more about ${highlight} in ${cityName}, ${country}`}>
      {highlightInfo.icon}
      <span>{highlight}</span>
    </a>
  );
};
