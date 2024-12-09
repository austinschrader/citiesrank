// src/features/map/components/CityMap.tsx
import { MapControls } from "@/features/map/components/MapControls";
import { MapMarker } from "@/features/map/components/MapMarker";
import { useMapState } from "@/features/map/hooks/useMapState";
import { MapPlace } from "@/features/map/types";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { calculateMapBounds } from "../utils/mapUtils";
import { PlaceGeoJson } from "./PlaceGeoJson";

// Component to handle map updates
const MapUpdater = ({
  selectedPlace,
  shouldReset,
  defaultCenter,
  defaultZoom,
}: {
  selectedPlace: MapPlace | null;
  shouldReset: boolean;
  defaultCenter: [number, number];
  defaultZoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      const bounds = calculateMapBounds(selectedPlace);
      map.setView(bounds.center, bounds.zoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [selectedPlace, map]);

  useEffect(() => {
    if (shouldReset) {
      map.setView(defaultCenter, defaultZoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [shouldReset, defaultCenter, defaultZoom, map]);

  return null;
};

interface CityMapProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
  className?: string;
}

export const CityMap = ({ places, onPlaceSelect, className }: CityMapProps) => {
  const { mapState, setZoom } = useMapState();
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const handlePlaceSelect = useCallback(
    (place: MapPlace) => {
      setSelectedPlace((prev) => (prev?.id === place.id ? null : place));
      onPlaceSelect?.(place);
    },
    [onPlaceSelect]
  );

  const handleReset = useCallback(() => {
    setShouldReset(true);
    setSelectedPlace(null);
    setZoom(3); // Set initial zoom level
  }, [setZoom]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
    }
  }, [shouldReset]);

  return (
    <div className={className}>
      <MapContainer
        center={mapState.center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl"
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <MapControls
          onZoomChange={setZoom}
          defaultCenter={[20, 0]}
          defaultZoom={3}
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
              onSelect={handlePlaceSelect}
              isSelected={selectedPlace?.id === place.id}
            />
          ))}
        {selectedPlace && (
          <PlaceGeoJson
            key={`geojson-${selectedPlace.id}`}
            place={selectedPlace}
          />
        )}
        <MapUpdater
          selectedPlace={selectedPlace}
          shouldReset={shouldReset}
          defaultCenter={[20, 0]}
          defaultZoom={2}
        />
      </MapContainer>
    </div>
  );
};
