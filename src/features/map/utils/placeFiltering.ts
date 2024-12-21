/**
 * placeFiltering.ts
 * 
 * Purpose:
 * Provides pure utility functions for filtering map places based on different criteria.
 * These functions are stateless and don't depend on React or context state.
 * 
 * Responsibilities:
 * - Filter places by map bounds
 * - Filter places by zoom level (with population-based visibility)
 * - Filter places by type
 * - Handle population category filtering
 * 
 * Interaction with MapContext:
 * - MapContext owns the state (zoom, bounds, etc) and orchestrates when/how filters are applied
 * - MapContext handles scoring/prioritization because it depends on map-specific state
 * - getVisiblePlacesForCurrentView stays in MapContext as it coordinates multiple filters
 * - calculatePlaceScore stays in MapContext as it uses map-specific distance calculations
 * 
 * Interaction with FiltersContext:
 * - Uses types from FiltersContext (PopulationCategory)
 * - Applies filters based on state managed by FiltersContext
 */

import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { MapPlace } from "../types";
import L from "leaflet";
import { PopulationCategory } from "@/features/places/context/FiltersContext";

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
 * Uses a probabilistic approach to gradually show/hide places:
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
  const isInPopulationRange = (population: string | null, category: PopulationCategory): boolean => {
    if (!population) return false;
    const pop = parseInt(population, 10);
    if (isNaN(pop)) return false;

    switch (category) {
      case "village":
        return pop < 10000;
      case "town":
        return pop >= 10000 && pop < 50000;
      case "city":
        return pop >= 50000 && pop < 1000000;
      case "megacity":
        return pop >= 1000000;
    }
  };

  // If population category is active, filter by that first
  if (populationCategory !== null) {
    return places.filter((place) => 
      place.type === CitiesTypeOptions.city && 
      isInPopulationRange(place.population as string, populationCategory)
    );
  }

  // Otherwise use standard zoom-based filtering
  return places.filter((place) => {
    if (!place.type || !place.id) return false;

    const threshold = getVisibilityThreshold(place, zoom);
    return getRandomForPlace(place) < threshold;
  });
}

/**
 * Calculates the visibility threshold for a place based on its type and the zoom level.
 * Higher threshold = more likely to be visible.
 * 
 * @param place - Place to calculate threshold for
 * @param zoom - Current map zoom level
 * @returns Number between 0-1 representing visibility threshold
 */
function getVisibilityThreshold(place: MapPlace, zoom: number): number {
  const baseThreshold = Math.min(1, Math.max(0.1, (zoom / ZOOM_LEVELS.CITY) * 0.8));

  if (place.type === CitiesTypeOptions.country) {
    // Always show countries at low zoom, higher chance at high zoom
    return zoom <= ZOOM_LEVELS.COUNTRY ? 1 : baseThreshold * 2;
  }

  if (place.type === CitiesTypeOptions.region) {
    // Increased threshold for regions
    return zoom > ZOOM_LEVELS.REGION ? 1 : baseThreshold * 1.5;
  }

  if (place.type === CitiesTypeOptions.city) {
    const population = parseInt(place.population as string, 10);
    if (!isNaN(population)) {
      if (population >= 1000000) return 1; // Always show major cities
      if (population >= 500000) return baseThreshold * 1.5;
      return baseThreshold;
    }
  }

  if (place.type === CitiesTypeOptions.sight || 
      place.type === CitiesTypeOptions.neighborhood) {
    return zoom > ZOOM_LEVELS.COUNTRY ? 0.9 : baseThreshold * 0.5;
  }

  return baseThreshold;
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
  if (!mapBounds) return places;
  return places.filter((place) => {
    if (!place.latitude || !place.longitude) return false;
    return mapBounds.contains([place.latitude, place.longitude]);
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
  return places.filter((place) => activeTypes.includes(place.type as CitiesTypeOptions));
}
