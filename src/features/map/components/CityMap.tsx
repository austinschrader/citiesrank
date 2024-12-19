// file location: src/features/map/components/CityMap.tsx
/**
 * Main map component that renders interactive city locations with markers.
 * Handles map interactions, marker clicks, and location selection.
 * Uses MapContext for state management and Leaflet for map rendering.
 */

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap as useLeafletMap,
} from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapCluster } from "./MapCluster";
import { MapControls } from "./MapControls";
import { PlaceGeoJson } from "./PlaceGeoJson";

interface CityMapProps {
  className?: string;
}

const BoundsTracker = () => {
  const map = useLeafletMap();
  const { setMapBounds } = useMap();

  useEffect(() => {
    const handleMove = () => {
      const bounds = map.getBounds();
      setMapBounds(bounds);
    };

    map.on("moveend", handleMove);
    // Set initial bounds immediately
    requestAnimationFrame(() => {
      handleMove();
    });

    return () => {
      map.off("moveend", handleMove);
    };
  }, [map, setMapBounds]);

  return null;
};

export const CityMap = ({ className }: CityMapProps) => {
  const { center, zoom, selectedPlace, setZoom } = useMap();

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl relative z-0"
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <BoundsTracker />
        <MapControls
          onZoomChange={setZoom}
          defaultCenter={[20, 0]}
          defaultZoom={2}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        {/* Map Markers */}
        <MapCluster />
        {selectedPlace && (
          <PlaceGeoJson
            key={`geojson-${selectedPlace.id}`}
            place={selectedPlace}
          />
        )}
      </MapContainer>
    </div>
  );
};
