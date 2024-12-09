// src/features/map/components/CityMap.tsx
import { MapControls } from "@/features/map/components/MapControls";
import { MapMarker } from "@/features/map/components/MapMarker";
import { useMapState } from "@/features/map/hooks/useMapState";
import { MapPlace } from "@/features/map/types";
import { MapContainer, TileLayer } from "react-leaflet";

interface CityMapProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
  className?: string;
}

export const CityMap = ({ places, onPlaceSelect, className }: CityMapProps) => {
  const { mapState, setZoom } = useMapState();

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
              onSelect={onPlaceSelect ? 
                () => onPlaceSelect(place) : 
                undefined
              } 
            />
          ))}
      </MapContainer>
    </div>
  );
};
