// src/features/map/components/MapMarker.tsx
/**
 * Renders an interactive marker on the map for a specific place.
 * Handles marker styling, click events, and popup displays.
 * Integrates with the parent CityMap component for place selection.
 */
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import L from "leaflet";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapMarkerProps, MarkerStyle } from "../types";
import { PlaceGeoJson } from "./PlaceGeoJson";

const getMarkerStyle = (rating?: number): MarkerStyle => {
  if (!rating) return { color: "#94a3b8", size: 36 }; // No rating - slate
  if (rating >= 4.5) return { color: "#10b981", size: 48 }; // High rating - emerald
  if (rating >= 4.0) return { color: "#3b82f6", size: 44 }; // Good rating - blue
  if (rating >= 3.5) return { color: "#f59e0b", size: 40 }; // Average rating - amber
  if (rating >= 3.0) return { color: "#ef4444", size: 36 }; // Low rating - red
  return { color: "#94a3b8", size: 36 }; // Below 3.0 - slate
};

const createMarkerHtml = (
  style: MarkerStyle,
  rating?: number,
  isSelected?: boolean
) => {
  return `<div class="place-marker" style="
    width: ${style.size}px;
    height: ${style.size}px;
    background-color: ${style.color};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: ${style.size * 0.4}px;
    font-weight: bold;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 2px solid ${isSelected ? "white" : "rgba(255, 255, 255, 0.8)"};
    transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
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

  const markerStyle = getMarkerStyle(place.averageRating);

  const icon = L.divIcon({
    className: "custom-rating-marker",
    html: createMarkerHtml(markerStyle, place.averageRating, isSelected),
    iconSize: [markerStyle.size, markerStyle.size],
    iconAnchor: [markerStyle.size / 2, markerStyle.size / 2],
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
          },
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
