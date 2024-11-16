import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Landmark, Building, Trees, Utensils, Palette } from "lucide-react";
import { RankedCity } from "../types";
import { cn } from "@/lib/utils";

type HighlightCategory = {
  type: "historic" | "urban" | "nature" | "dining" | "cultural";
  icon: React.ReactNode;
  className: string;
  label: string;
  description: string;
};

const CATEGORIES: Record<string, HighlightCategory> = {
  historic: {
    type: "historic",
    icon: <Landmark className="w-4 h-4" />,
    className: "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200",
    label: "Historical",
    description: "Monuments, castles, bridges",
  },
  urban: {
    type: "urban",
    icon: <Building className="w-4 h-4" />,
    className: "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200",
    label: "Urban",
    description: "Districts, streets, architecture",
  },
  nature: {
    type: "nature",
    icon: <Trees className="w-4 h-4" />,
    className: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
    label: "Nature",
    description: "Parks, gardens, outdoors",
  },
  dining: {
    type: "dining",
    icon: <Utensils className="w-4 h-4" />,
    className: "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200",
    label: "Food & Drink",
    description: "Markets, restaurants, cafes",
  },
  cultural: {
    type: "cultural",
    icon: <Palette className="w-4 h-4" />,
    className: "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200",
    label: "Cultural",
    description: "Museums, theaters, venues",
  },
};
interface HighlightLinkProps {
  highlight: string;
  cityName: string;
  country: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface CityCardProps {
  city: RankedCity;
}

const Legend = () => (
  <div className="flex flex-wrap gap-3 mb-4 text-sm">
    {Object.values(CATEGORIES).map((category) => (
      <div key={category.type} className="relative group">
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-help", category.className)}>
          {category.icon}
          <span>{category.label}</span>
        </div>
        <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-white rounded-lg shadow-lg border text-xs">
          {category.description}
        </div>
      </div>
    ))}
  </div>
);

const HighlightLink = ({ highlight, cityName, country, onClick }: HighlightLinkProps) => {
  const getHighlightType = (text: string): HighlightCategory => {
    const lowercase = text.toLowerCase();

    // Historical Sites
    if (lowercase.includes("castle") || lowercase.includes("bridge") || lowercase.includes("tower") || lowercase.includes("monument")) {
      return CATEGORIES.historic;
    }

    // Urban Areas & Architecture
    if (
      lowercase.includes("district") ||
      lowercase.includes("square") ||
      lowercase.includes("cathedral") ||
      lowercase.includes("basilica")
    ) {
      return CATEGORIES.urban;
    }

    // Natural Spaces
    if (lowercase.includes("park") || lowercase.includes("garden") || lowercase.includes("nature") || lowercase.includes("way")) {
      return CATEGORIES.nature;
    }

    // Food and Drink
    if (lowercase.includes("market") || lowercase.includes("restaurant") || lowercase.includes("wine") || lowercase.includes("food")) {
      return CATEGORIES.dining;
    }

    // Cultural Venues
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

export const CityCard = ({ city }: CityCardProps) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-50 text-green-700";
    if (score >= 75) return "bg-blue-50 text-blue-700";
    if (score >= 60) return "bg-yellow-50 text-yellow-700";
    return "bg-gray-50 text-gray-700";
  };

  const citySlug = city.name.toLowerCase().replace(/\s+/g, "-");
  const countrySlug = city.country.toLowerCase().replace(/\s+/g, "-");

  const handleHighlightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = (e.currentTarget as HTMLAnchorElement).href;
    // TODO: Replace with your routing implementation
    console.log("Would navigate to:", url);
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

  return (
    <Card className="group overflow-hidden border-none shadow-none hover:shadow-lg transition-all duration-300">
      <div className="aspect-[16/10] relative overflow-hidden rounded-xl bg-neutral-100">
        <picture>
          <source media="(max-width: 640px)" srcSet={`/images/${citySlug}-400.jpg 1x, /images/${citySlug}-800.jpg 2x`} />
          <source media="(max-width: 1024px)" srcSet={`/images/${citySlug}-600.jpg 1x, /images/${citySlug}-1200.jpg 2x`} />
          <source media="(min-width: 1025px)" srcSet={`/images/${citySlug}-800.jpg 1x, /images/${citySlug}-1600.jpg 2x`} />
          <img
            src={`/images/${citySlug}-800.jpg`}
            alt={`${city.name}, ${city.country}`}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 transform-gpu"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" aria-hidden="true" />
        <button
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white transition-colors hover:scale-110 active:scale-95"
          aria-label="Save to favorites">
          <Star className="w-6 h-6" />
        </button>
        <div className={cn("absolute top-4 left-4 px-4 py-2 rounded-full text-base font-medium shadow-sm", getMatchColor(city.matchScore))}>
          {Math.round(city.matchScore)}% match
        </div>
      </div>

      <div className="pt-5 pb-2 px-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <a
              href={`/${countrySlug}/${citySlug}`}
              className="font-semibold text-xl hover:text-primary transition-colors"
              onClick={handleCityClick}>
              {city.name}
            </a>
            <span className="text-muted-foreground">,</span>
            <a
              href={`/${countrySlug}`}
              className="text-lg text-muted-foreground hover:text-primary/80 transition-colors"
              onClick={handleCountryClick}>
              {city.country}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-base text-muted-foreground mb-3">
          <MapPin className="w-5 h-5 shrink-0" />
          <span>{city.population} residents</span>
        </div>

        <p className="text-base text-muted-foreground mb-4 line-clamp-2">{city.description}</p>

        <Legend />

        <div className="flex flex-wrap gap-2">
          {city.highlights.map((highlight, index) => (
            <HighlightLink key={index} highlight={highlight} cityName={city.name} country={city.country} onClick={handleHighlightClick} />
          ))}
        </div>
      </div>
    </Card>
  );
};
