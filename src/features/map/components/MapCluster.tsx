// src/features/map/components/MapCluster.tsx
/**
 * Handles map clustering logic, showing different place levels (countries/regions/cities)
 * based on zoom level. Integrates with existing FiltersContext for filtering.
 */

import { useFilters } from "@/features/places/context/FiltersContext";
import { useMemo, useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapPlace } from "../types";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
}

export const MapCluster = ({ places, onPlaceSelect }: MapClusterProps) => {
  const { zoom, setMapBounds, setVisiblePlaces, visiblePlacesInView, numPrioritizedToShow } = useMap();
  const { filters } = useFilters();
  const map = useLeafletMap();

  // Update map bounds when the map moves
  useEffect(() => {
    const onMoveEnd = () => {
      setMapBounds(map.getBounds());
    };
    
    // Set initial bounds
    setMapBounds(map.getBounds());
    
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [map, setMapBounds]);

  // Update visible places when places prop changes
  useEffect(() => {
    setVisiblePlaces(places);
  }, [places, setVisiblePlaces]);

  // Get the prioritized places to show on map
  const placesToShow = useMemo(() => {
    if (!visiblePlacesInView) return [];
    return visiblePlacesInView.slice(0, numPrioritizedToShow);
  }, [visiblePlacesInView, numPrioritizedToShow]);

  return (
    <>
      {placesToShow.map((place: MapPlace) => (
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
