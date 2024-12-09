// src/features/map/components/MapMarker.tsx
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { MapPlace } from "../types";

interface MapMarkerProps {
  place: MapPlace;
  onSelect?: (place: MapPlace) => void;
}

const getMarkerColor = (rating?: number) => {
  if (!rating) return "#6b7280"; // No rating - gray
  if (rating >= 4.5) return "#22c55e"; // High rating - green
  if (rating >= 4.0) return "#3b82f6"; // Good rating - blue
  if (rating >= 3.5) return "#f59e0b"; // Average rating - yellow
  if (rating >= 3.0) return "#ef4444"; // Low rating - red
  return "#6b7280"; // Below 3.0 - gray
};

const createMarkerHtml = (size: number, color: string, rating?: number) => {
  return `<div style="
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: ${size * 0.4}px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    cursor: pointer;
  ">${rating?.toFixed(1) || ""}</div>`;
};

export const MapMarker = ({ place, onSelect }: MapMarkerProps) => {
  if (!place.latitude || !place.longitude) return null;

  const markerSize = place.averageRating
    ? Math.max(30, place.averageRating * 10)
    : 30;
  const markerColor = getMarkerColor(place.averageRating);

  const icon = L.divIcon({
    className: "custom-rating-marker",
    html: createMarkerHtml(markerSize, markerColor, place.averageRating),
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize / 2, markerSize / 2],
  });

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={{ click: () => onSelect?.(place) }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{place.name}</h3>
          <p className="text-sm text-muted-foreground">
            {place.description}
          </p>
          {place.matchScore && (
            <p className="text-sm text-muted-foreground">
              Match Score: {place.matchScore}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
