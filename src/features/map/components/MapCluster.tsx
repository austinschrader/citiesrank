// src/features/map/components/MapCluster.tsx
/**
 * Handles map clustering logic, showing different place levels (countries/regions/cities)
 * based on zoom level. Integrates with existing FiltersContext for filtering.
 */

import { useMap } from "../context/MapContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { MapPlace } from "../types";
import { useMemo } from "react";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
}

export const MapCluster = ({ places, onPlaceSelect }: MapClusterProps) => {
  const { zoom } = useMap();
  const { filters } = useFilters();

  const visiblePlaces = useMemo(() => {
    // Filter places based on zoom level
    const getPlacesByLevel = () => {
      if (zoom <= 3) {
        return places.filter(place => place.type === "country");
      } else if (zoom <= 5) {
        return places.filter(place => place.type === "region" || place.type === "country");
      } else if (zoom <= 8) {
        return places.filter(place => place.type === "city" || place.type === "region");
      }
      return places; // Show all places at high zoom levels
    };

    // Apply existing filters from FiltersContext
    return getPlacesByLevel().filter(place => {
      if (!place.latitude || !place.longitude) return false;
      if (filters.placeType && place.type !== filters.placeType) return false;
      // Add other filter conditions as needed
      return true;
    });
  }, [places, zoom, filters]);

  return (
    <>
      {visiblePlaces.map((place) => (
        <MapMarker
          key={place.id}
          place={place}
          onSelect={() => onPlaceSelect?.(place)}
          isSelected={false}
        />
      ))}
    </>
  );
};
