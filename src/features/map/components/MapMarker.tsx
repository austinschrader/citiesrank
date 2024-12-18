// file location: src/features/map/components/MapMarker.tsx
/**
 * Renders an interactive marker on the map for a specific place.
 * Handles marker styling, click events, and popup displays.
 * Integrates with the parent CityMap component for place selection.
 */
import { PlaceCard } from "@/features/places/components/cards/PlaceCard";
import { getCountryCode } from "@/lib/utils/countryUtils";
import * as Flags from "country-flag-icons/react/3x2";
import L from "leaflet";
import { Building, Building2, Landmark, MapPin } from "lucide-react";
import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { MapMarkerProps, MapPlace, MarkerStyle } from "../types";
import { PlaceGeoJson } from "./PlaceGeoJson";

const getMarkerStyle = (type?: string): MarkerStyle => {
  let color = "#4b5563"; // Default gray
  let backgroundColor = "#ffffff";
  let size = 44; // Slightly larger for better readability

  switch (type) {
    case "region":
      color = "#ffffff";
      backgroundColor = "#2563eb"; // Blue-600
      break;
    case "city":
      color = "#ffffff";
      backgroundColor = "#059669"; // Emerald-600
      break;
    case "neighborhood":
      color = "#ffffff";
      backgroundColor = "#d97706"; // Amber-600
      break;
    case "sight":
      color = "#ffffff";
      backgroundColor = "#dc2626"; // Red-600
      break;
  }

  return { color, backgroundColor, size };
};

const createMarkerHtml = (
  style: MarkerStyle,
  place: MapPlace,
  isSelected?: boolean
) => {
  const rating = place.averageRating ? place.averageRating.toFixed(1) : null;
  const type = place.type.charAt(0).toUpperCase() + place.type.slice(1);
  
  return `<div class="place-marker-container" style="
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
    transition: all 0.2s ease-in-out;
  ">
    <div style="
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${style.backgroundColor};
      color: ${style.color};
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      white-space: nowrap;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    ">
      ${place.name}
    </div>
    <div class="place-marker" style="
      position: relative;
      width: ${style.size}px;
      height: ${style.size}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${style.color};
      background-color: ${style.backgroundColor};
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      font-weight: 500;
      line-height: 1.2;
      gap: 2px;
    ">
      <div style="font-size: 11px;">${type}</div>
      ${rating ? `
        <div style="
          font-size: 13px;
          font-weight: 600;
        ">
          ${rating}
        </div>
      ` : ''}
    </div>
  </div>
  <style>
    .place-marker-container:hover {
      transform: scale(1.2);
      z-index: 1000;
    }
    .place-marker-container {
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
  </style>`;
};

export const MapMarker = ({ place, onSelect, isSelected }: MapMarkerProps) => {
  const [showGeoJson, setShowGeoJson] = useState(false);

  if (!place.latitude || !place.longitude) return null;

  const markerStyle = getMarkerStyle(place.type);

  const icon = L.divIcon({
    className: "custom-marker",
    html: createMarkerHtml(markerStyle, place, isSelected),
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
