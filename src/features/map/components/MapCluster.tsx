// src/features/map/components/MapCluster.tsx
/**
 * Handles map clustering logic, showing different place levels (countries/regions/cities)
 * based on zoom level. Integrates with existing FiltersContext for filtering.
 */

import { useFilters } from "@/features/places/context/FiltersContext";
import { useMemo } from "react";
import { useMap } from "../context/MapContext";
import { MapPlace } from "../types";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
}

export const MapCluster = ({ places, onPlaceSelect }: MapClusterProps) => {
  const { zoom } = useMap();
  const { filters } = useFilters();

  const filterPlacesByZoom = (places: MapPlace[], zoom: number): MapPlace[] => {
    return places.filter((place) => {
      if (zoom <= 3) {
        // World view - countries only
        return place.type === "country";
      } else if (zoom <= 5) {
        // Continental view - countries and regions
        return ["country", "region"].includes(place.type);
      } else if (zoom <= 8) {
        // Country view - regions and cities
        return ["region", "city"].includes(place.type);
      } else if (zoom <= 11) {
        // Regional view - cities and neighborhoods
        return ["city", "neighborhood"].includes(place.type);
      } else {
        // Local view - neighborhoods and sights
        return ["neighborhood", "sight"].includes(place.type);
      }
    });
  };

  const visiblePlaces = useMemo(() => {
    // Apply existing filters from FiltersContext
    return filterPlacesByZoom(places, zoom).filter((place) => {
      if (!place.latitude || !place.longitude) return false;
      if (filters.placeType && place.type !== filters.placeType) return false;
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
