// src/features/map/components/MapMarker.tsx
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { MapPlace } from "../types";
import { PlaceCard } from "@/features/places/components/PlaceCard";
import { PlaceGeoJson } from "./PlaceGeoJson";
import { useState } from "react";

interface MapMarkerProps {
  place: MapPlace;
  onSelect?: (place: MapPlace) => void;
  isSelected?: boolean;
}

const getMarkerColor = (rating?: number) => {
  if (!rating) return "#94a3b8"; // No rating - slate
  if (rating >= 4.5) return "#10b981"; // High rating - emerald
  if (rating >= 4.0) return "#3b82f6"; // Good rating - blue
  if (rating >= 3.5) return "#f59e0b"; // Average rating - amber
  if (rating >= 3.0) return "#ef4444"; // Low rating - red
  return "#94a3b8"; // Below 3.0 - slate
};

const createMarkerHtml = (size: number, color: string, rating?: number, isSelected?: boolean) => {
  return `<div class="place-marker" style="
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
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 2px solid ${isSelected ? 'white' : 'rgba(255, 255, 255, 0.8)'};
    transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
  ">${rating?.toFixed(1) || ""}</div>
  <style>
    .place-marker:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  </style>`;
};

export const MapMarker = ({ place, onSelect, isSelected }: MapMarkerProps) => {
  const [showGeoJson, setShowGeoJson] = useState(false);

  if (!place.latitude || !place.longitude) return null;

  const markerSize = place.averageRating
    ? Math.max(36, place.averageRating * 12)
    : 36;
  const markerColor = getMarkerColor(place.averageRating);

  const icon = L.divIcon({
    className: "custom-rating-marker",
    html: createMarkerHtml(markerSize, markerColor, place.averageRating, isSelected),
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize / 2, markerSize / 2],
  });

  const handleClick = () => {
    setShowGeoJson(!showGeoJson);
    onSelect?.(place);
  };

  return (
    <>
      <Marker
        position={[place.latitude, place.longitude]}
        icon={icon}
        eventHandlers={{
          click: handleClick,
          mouseover: (e) => {
            const el = e.target.getElement();
            el.style.zIndex = "1000";
          },
          mouseout: (e) => {
            const el = e.target.getElement();
            el.style.zIndex = "";
          }
        }}
      >
        <Popup>
          <div className="p-3 min-w-[320px]">
            <PlaceCard city={place} variant="compact" />
          </div>
        </Popup>
      </Marker>
      {showGeoJson && <PlaceGeoJson place={place} />}
    </>
  );
};
