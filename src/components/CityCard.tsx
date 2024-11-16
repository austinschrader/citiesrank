import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { RankedCity } from "../types";
import { cn } from "@/lib/utils";
import { HighlightLink } from "@/components/HighlightLink";

interface CityCardProps {
  city: RankedCity;
}

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

        <div className="flex flex-wrap gap-2">
          {city.highlights.map((highlight, index) => (
            <HighlightLink key={index} highlight={highlight} cityName={city.name} country={city.country} onClick={handleHighlightClick} />
          ))}
        </div>
      </div>
    </Card>
  );
};
