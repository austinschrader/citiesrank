// file location: src/features/map/components/CityMap.tsx
/**
 * Main map component that renders interactive city locations with markers.
 * Handles map interactions, marker clicks, and location selection.
 * Uses MapContext for state management and Leaflet for map rendering.
 */

import type { MapPlace } from "@/features/map/types";
import { MapContainer, TileLayer, useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapControls } from "./MapControls";
import { MapCluster } from "./MapCluster";
import { PlaceGeoJson } from "./PlaceGeoJson";
import { useEffect } from "react";
import L from "leaflet";

interface CityMapProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
  className?: string;
}

const BoundsTracker = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
  const map = useLeafletMap();

  useEffect(() => {
    const handleMove = () => {
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    };

    map.on('moveend', handleMove);
    // Set initial bounds immediately
    requestAnimationFrame(() => {
      handleMove();
    });

    return () => {
      map.off('moveend', handleMove);
    };
  }, [map, onBoundsChange]);

  return null;
};

export const CityMap = ({ places, onPlaceSelect, onBoundsChange, className }: CityMapProps) => {
  const { center, zoom, selectedPlace, selectPlace, setZoom } = useMap();

  const handlePlaceSelect = (place: MapPlace) => {
    selectPlace(place);
    onPlaceSelect?.(place);
  };

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
        {onBoundsChange && <BoundsTracker onBoundsChange={onBoundsChange} />}
        <MapControls
          onZoomChange={setZoom}
          defaultCenter={[20, 0]}
          defaultZoom={2}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <MapCluster places={places} onPlaceSelect={handlePlaceSelect} />
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
