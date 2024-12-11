// src/features/map/components/CityMap.tsx
import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useMapState } from "../hooks/useMapState";
import { mapService } from "../services/mapService";
import { MapPlace } from "../types";
import { MapControls } from "./MapControls";
import { MapMarker } from "./MapMarker";
import { PlaceGeoJson } from "./PlaceGeoJson";

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
      const bounds = mapService.calculateBounds(selectedPlace);
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
      // If the same place is clicked, deselect it
      setSelectedPlace((prev) => (prev?.id === place.id ? null : place));
      onPlaceSelect?.(place);
    },
    [onPlaceSelect]
  );

  const handleReset = useCallback(() => {
    setShouldReset(true);
    setSelectedPlace(null);
    setZoom(3);
  }, [setZoom]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
    }
  }, [shouldReset]);

  return (
    <div
      className={`${className} relative`}
      style={{
        height: "calc(100vh - 13rem)",
        minHeight: "500px",
        maxHeight: "100vh",
      }}
    >
      <MapContainer
        center={mapState.center}
        zoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl relative z-0 sm:rounded-2xl md:rounded-3xl"
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
          className="absolute right-4 top-4 z-[1000] flex flex-col gap-2 sm:right-6 sm:top-6"
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
        {/* Only render GeoJSON for selected place */}
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
