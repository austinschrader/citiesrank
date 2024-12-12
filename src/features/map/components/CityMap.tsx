// src/features/map/components/CityMap.tsx
/**
 * Main map component that renders interactive city locations with markers.
 * Handles map interactions, marker clicks, and location selection.
 * Uses MapContext for state management and Leaflet for map rendering.
 */

import type { MapPlace } from "@/features/map/types";
import { MapContainer, TileLayer } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapControls } from "./MapControls";
import { MapMarker } from "./MapMarker";
import { PlaceGeoJson } from "./PlaceGeoJson";

interface CityMapProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
  className?: string;
}

export const CityMap = ({ places, onPlaceSelect, className }: CityMapProps) => {
  const { center, zoom, selectedPlace, selectPlace, setZoom } = useMap();

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl"
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <MapControls
          onZoomChange={setZoom}
          defaultCenter={[20, 0]}
          defaultZoom={2}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        {places
          .filter((place) => place.latitude && place.longitude)
          .map((place) => (
            <MapMarker
              key={place.id}
              place={place}
              onSelect={(p) => {
                selectPlace(p);
                onPlaceSelect?.(p);
              }}
              isSelected={selectedPlace?.id === place.id}
            />
          ))}
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
