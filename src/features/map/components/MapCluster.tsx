// src/features/map/components/MapCluster.tsx
/**
 * Handles map clustering logic, showing different place levels (countries/regions/cities)
 * based on zoom level. Integrates with existing FiltersContext for filtering.
 */

import { useEffect, useMemo } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapPlace } from "../types";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {}

export const MapCluster = ({}: MapClusterProps) => {
  const {
    setMapBounds,
    setVisiblePlaces,
    visiblePlaces,
    visiblePlacesInView,
    numPrioritizedToShow,
    selectPlace,
  } = useMap();
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

  // Update visible places when visiblePlaces changes
  useEffect(() => {
    setVisiblePlaces(visiblePlaces);
  }, [visiblePlaces, setVisiblePlaces]);

  // Get the prioritized places to show on map
  const placesToShow = useMemo(() => {
    if (!visiblePlacesInView) return [];
    return visiblePlacesInView.slice(0, numPrioritizedToShow);
  }, [visiblePlacesInView, numPrioritizedToShow]);

  return (
    <>
      {placesToShow.map((place: MapPlace) => (
        <MapMarker key={place.id} place={place} onSelect={selectPlace} />
      ))}
    </>
  );
};
