// src/features/map/components/MapCluster.tsx
/**
 * Renders map markers for prioritized places.
 * Uses MapMarker component to display individual places
 * and handles marker selection.
 */

import { useMap } from "../context/MapContext";
import { MapMarker } from "./MapMarker";

interface MapClusterProps {}

export const MapCluster = () => {
  const { prioritizedPlaces, selectPlace } = useMap();

  return (
    <>
      {prioritizedPlaces.map((place) => (
        <MapMarker key={place.id} place={place} onSelect={selectPlace} />
      ))}
    </>
  );
};
