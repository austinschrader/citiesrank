import { PlaceModal } from "@/features/map/components/PlaceModal";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import L from "leaflet";
import { useState } from "react";
import { Marker } from "react-leaflet";
import { MapMarkerProps, MapPlace } from "../types";

// Helper functions
const getMarkerStyle = (type?: string, rating?: number) => {
  const getRatingColor = (rating?: number) => {
    if (!rating) return ratingColors.none;
    if (rating >= 4.8) return ratingColors.best;
    if (rating >= 4.5) return ratingColors.great;
    if (rating >= 4.2) return ratingColors.good;
    if (rating >= 3.8) return ratingColors.okay;
    if (rating >= 3.4) return ratingColors.fair;
    return ratingColors.poor;
  };

  const typeColor =
    type && type in markerColors
      ? markerColors[type as keyof typeof markerColors]
      : markerColors.default;

  return {
    color: typeColor,
    ratingColor: getRatingColor(rating),
    size: 40,
  };
};

const createMarkerHtml = (
  style: ReturnType<typeof getMarkerStyle>,
  place: MapPlace,
  isSelected?: boolean
) => {
  const rating = place.averageRating ? place.averageRating.toFixed(1) : null;

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
      background-color: ${style.color};
      color: #ffffff;
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
    <div class="place-marker-wrapper" style="
      position: relative;
      width: ${style.size}px;
      height: ${style.size}px;
    ">
      <div class="place-marker" style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${style.ratingColor};
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      ">
        ${
          rating
            ? `
          <div style="
            font-size: ${rating.length > 2 ? "13px" : "14px"};
            font-weight: 600;
            color: #ffffff;
          ">
            ${rating}
          </div>
        `
            : ""
        }
      </div>
    </div>
  </div>`;
};

export const MapMarker = ({ place, onSelect, isSelected }: MapMarkerProps) => {
  const [showModal, setShowModal] = useState(false);

  if (!place.latitude || !place.longitude) return null;

  const markerStyle = getMarkerStyle(place.type, place.averageRating);

  const icon = L.divIcon({
    className: "custom-marker",
    html: createMarkerHtml(markerStyle, place, isSelected),
    iconSize: [markerStyle.size, markerStyle.size],
    iconAnchor: [markerStyle.size / 2, markerStyle.size / 2],
  });

  const handleMarkerClick = (e: L.LeafletMouseEvent) => {
    // Prevent event from propagating to map
    L.DomEvent.stopPropagation(e);
    setShowModal(true);
    if (onSelect) {
      onSelect(place);
    }
  };

  return (
    <>
      <Marker
        position={[place.latitude, place.longitude]}
        icon={icon}
        eventHandlers={{
          click: handleMarkerClick,
          mouseover: (e) => {
            const el = e.target.getElement();
            el.style.zIndex = "1000";
          },
          mouseout: (e) => {
            const el = e.target.getElement();
            el.style.zIndex = "";
          },
        }}
      />
      <PlaceModal
        place={place}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
