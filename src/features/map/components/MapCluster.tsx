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
  const { zoom } = useMap();
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
    const bounds = map.getBounds();

    const filtered = filterPlacesByZoom(places, zoom).filter((place) => {
      if (!place.latitude || !place.longitude) return false;
      if (filters.placeType && place.type !== filters.placeType) return false;
      // Check if place is within current map bounds
      return bounds.contains([place.latitude, place.longitude]);
    });

    // Sort all places by average rating
    const sorted = filtered.sort((a, b) => {
      const ratingA = typeof a.averageRating === "number" ? a.averageRating : 0;
      const ratingB = typeof b.averageRating === "number" ? b.averageRating : 0;
      return ratingB - ratingA;
    });

    return sorted.slice(0, 40);
  }, [places, zoom, filters, map, mapPosition]);

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
