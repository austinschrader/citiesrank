// src/features/map/components/CityMap.tsx
import { MapControls } from "@/features/map/components/MapControls";
import { MapMarker } from "@/features/map/components/MapMarker";
import { useMapState } from "@/features/map/hooks/useMapState";
import { MapPlace } from "@/features/map/types";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { PlaceGeoJson } from "./PlaceGeoJson";
import { useState, useCallback, useEffect } from "react";
import { calculateMapBounds } from "../utils/mapUtils";

// Component to handle map updates
const MapUpdater = ({ 
  selectedPlace 
}: { 
  selectedPlace: MapPlace | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      const { center, zoom } = calculateMapBounds(selectedPlace);
      map.setView(center, zoom, {
        animate: true,
        duration: 1 // 1 second animation
      });
    }
  }, [selectedPlace, map]);

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

  const handlePlaceSelect = useCallback((place: MapPlace) => {
    setSelectedPlace(prev => prev?.id === place.id ? null : place);
    onPlaceSelect?.(place);
  }, [onPlaceSelect]);

  return (
    <div className={className}>
      <MapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl"
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <MapControls
          onZoomChange={setZoom}
          defaultCenter={mapState.center}
          defaultZoom={mapState.zoom}
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
        <MapUpdater selectedPlace={selectedPlace} />
      </MapContainer>
    </div>
  );
};
