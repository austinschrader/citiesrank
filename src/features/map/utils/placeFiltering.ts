/**
 * Place filtering utilities for map visibility.
 *
 * Provides three main filtering functions:
 * - filterPlacesByZoom: Shows/hides places based on zoom level and importance
 * - filterPlacesByBounds: Filters places to those within the current map view
 * - filterPlacesByType: Filters places by their type (city, region, etc.)
 */

import { PopulationCategory } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import L from "leaflet";
import { MapPlace } from "../types";

/**
 * Constants defining the zoom levels at which different place types become visible.
 * These thresholds help manage the visual hierarchy of places on the map:
 * - Countries are prominent at low zoom levels (≤5)
 * - Regions become visible at slightly higher zoom (>6)
 * - Cities appear when zoomed in further (>8)
 * - Neighborhoods and sights show up at detailed zoom levels (>12)
 */
export const ZOOM_LEVELS = {
  COUNTRY: 5,
  REGION: 6,
  CITY: 8,
  NEIGHBORHOOD: 12,
} as const;

/**
 * Generates a consistent random number (0-1) for a place based on its properties.
 * Used to randomly but consistently show/hide places based on importance.
 *
 * @param place - The place to generate a random number for
 * @returns A number between 0 and 1
 */
export function getRandomForPlace(place: MapPlace): number {
  return hashString(`${place.id}-${place.latitude}-${place.longitude}`);
}

/**
 * Simple hash function that generates a consistent number between 0-1 for any string.
 * Used internally by getRandomForPlace.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

/**
 * Filters places based on the current map zoom level and place characteristics.
 * Uses a deterministic approach to show/hide places:
 *
 * 1. Countries: Always visible at low zoom, reduced visibility at high zoom
 * 2. Regions: Increased visibility above REGION zoom level
 * 3. Cities: Visibility based on population and zoom level
 *    - Major cities (1M+) always visible
 *    - Large cities (500k+) have increased visibility
 * 4. Neighborhoods/Sights: High visibility when zoomed in, low when zoomed out
 *
 * @param places - Array of places to filter
 * @param zoom - Current map zoom level
 * @param populationCategory - If not null, only shows cities within the specified population category
 * @returns Filtered array of places
 */
export function filterPlacesByZoom(
  places: MapPlace[],
  zoom: number,
  populationCategory: PopulationCategory | null
): MapPlace[] {
  // Helper function to get population in actual numbers
  const getPopulation = (place: MapPlace): number => {
    const pop = parseInt(place.population as string, 10);
    return !isNaN(pop) ? pop * 1000 : 0; // Convert from thousands to actual number
  };

  // If a population category is selected, only show cities within that category
  if (populationCategory) {
    return places.filter(
      (place) =>
        place.type !== CitiesTypeOptions.city ||
        isInPopulationRange(place.population as string, populationCategory)
    );
  }

  // Show all places when zoomed in close enough
  if (zoom > ZOOM_LEVELS.NEIGHBORHOOD) {
    return places;
  }

  // Medium zoom level - show cities, regions, and countries with some filtering
  if (zoom > ZOOM_LEVELS.CITY) {
    return places.filter((place) => {
      // Always show countries and regions
      if (
        place.type === CitiesTypeOptions.country ||
        place.type === CitiesTypeOptions.region
      ) {
        return true;
      }

      // Show all cities with population > 10k
      if (place.type === CitiesTypeOptions.city) {
        const population = getPopulation(place);
        const show = population > 10000;
        return show;
      }

      // Show neighborhoods and sights based on importance
      const importance = (place.averageRating || 0) * (place.totalReviews || 0);
      return importance > 1000;
    });
  }

  // Low zoom level - only show major cities, regions, and countries
  return places.filter((place) => {
    // Always show countries
    if (place.type === CitiesTypeOptions.country) {
      return true;
    }

    // Show regions with high importance
    if (place.type === CitiesTypeOptions.region) {
      const importance = (place.averageRating || 0) * (place.totalReviews || 0);
      return importance > 2000;
    }

    // Only show major cities (population > 50k)
    if (place.type === CitiesTypeOptions.city) {
      const population = getPopulation(place);
      const show = population > 50000;
      return show;
    }

    // Hide neighborhoods and sights at low zoom
    return false;
  });
}

/**
 * Filters places based on whether they fall within the current map bounds.
 *
 * @param places - Array of places to filter
 * @param mapBounds - Current map bounds
 * @returns Places that fall within the bounds
 */
export function filterPlacesByBounds(
  places: MapPlace[],
  mapBounds: L.LatLngBounds | null
): MapPlace[] {
  if (!mapBounds) {
    return places;
  }

  const bounds = {
    north: mapBounds.getNorth(),
    south: mapBounds.getSouth(),
    east: mapBounds.getEast(),
    west: mapBounds.getWest(),
  };

  return places.filter((place) => {
    if (!place.latitude || !place.longitude) {
      return false;
    }

    const lat = Number(place.latitude);
    const lng = Number(place.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }

    const latCheck = {
      isAboveSouth: lat >= bounds.south,
      isBelowNorth: lat <= bounds.north,
    };

    const lngCheck = {
      isEastOfWest: lng >= bounds.west,
      isWestOfEast: lng <= bounds.east,
    };

    const isInLatRange = latCheck.isAboveSouth && latCheck.isBelowNorth;
    const isInLngRange = lngCheck.isEastOfWest && lngCheck.isWestOfEast;
    const isInBounds = isInLatRange && isInLngRange;

    return isInBounds;
  });
}

/**
 * Filters places based on their type.
 *
 * @param places - Array of places to filter
 * @param activeTypes - Array of currently active place types
 * @returns Places that match the active types
 */
export function filterPlacesByType(
  places: MapPlace[],
  activeTypes: CitiesTypeOptions[]
): MapPlace[] {
  return places.filter((place) => {
    // If no active types, show all places
    if (activeTypes.length === 0) return true;

    // If place has no type, treat it as a city by default
    const placeType = place.type || CitiesTypeOptions.city;

    // Check if the place type is in active types
    const isActive = activeTypes.includes(placeType);
    return isActive;
  });
}

/**
 * Checks if a place's population falls within a specified range.
 *
 * @param population - Population of the place
 * @param category - Population category to check against
 * @returns True if the place's population falls within the category's range
 */
function isInPopulationRange(
  population: string | null,
  category: PopulationCategory
): boolean {
  if (!population) return false;
  const pop = parseInt(population, 10);
  if (isNaN(pop)) return false;

  switch (category) {
    case "village":
      return pop < 10;
    case "town":
      return pop >= 10 && pop < 50;
    case "city":
      return pop >= 50 && pop < 1000;
    case "megacity":
      return pop >= 1000;
  }
}
