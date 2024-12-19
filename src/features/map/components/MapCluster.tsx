// src/features/map/components/MapCluster.tsx
/**
 * Handles map clustering logic, showing different place levels (countries/regions/cities)
 * based on zoom level. Integrates with existing FiltersContext for filtering.
 */

import { useFilters } from "@/features/places/context/FiltersContext";
import { useEffect, useMemo, useState } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapPlace } from "../types";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
}

export const MapCluster = ({ places, onPlaceSelect }: MapClusterProps) => {
  const { zoom, filterPlacesByZoom } = useMap();
  const { filters } = useFilters();
  const map = useLeafletMap();
  const [mapPosition, setMapPosition] = useState(map.getCenter());

  useEffect(() => {
    const onMoveEnd = () => {
      setMapPosition(map.getCenter());
    };
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [map]);

  const visiblePlaces = useMemo(() => {
    const bounds = map.getBounds();

    const filtered = filterPlacesByZoom(places, zoom, !!filters.populationCategory)
      .filter((place) => {
        if (!place.latitude || !place.longitude) return false;
        if (!filters.activeTypes.includes(place.type as any)) return false;
        return bounds.contains([place.latitude, place.longitude]);
      });

    // Sort all places by average rating
    const sorted = filtered.sort((a, b) => {
      const ratingA = typeof a.averageRating === "number" ? a.averageRating : 0;
      const ratingB = typeof b.averageRating === "number" ? b.averageRating : 0;
      return ratingB - ratingA;
    });

    return sorted.slice(0, 40);
  }, [places, zoom, filters, map, mapPosition, filterPlacesByZoom]);

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
