// file location: src/features/map/utils/mapUtils.ts
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import { LatLngTuple } from "leaflet";
import { MapPlace } from "../types";

export function getZoomForPlaceType(type?: CitiesTypeOptions): number {
  switch (type) {
    case "sight":
      return 17; // Very close zoom for sights
    case "neighborhood":
      return 15; // Close zoom for neighborhoods
    case "city":
      return 12; // City level zoom
    case "region":
      return 7; // Region/state level zoom
    case "country":
      return 5; // Country level zoom
    default:
      return 12; // Default to city zoom level
  }
}

export function calculateMapBounds(place: MapPlace): {
  center: LatLngTuple;
  zoom: number;
} {
  const zoom = getZoomForPlaceType(place.type);
  const center: LatLngTuple = [place.latitude || 0, place.longitude || 0];

  return { center, zoom };
}

export const getMarkerStyle = (
  type?: string,
  rating?: number,
  isSelected?: boolean
) => {
  const getRatingColor = (rating?: number) => {
    if (!rating) return ratingColors.new; // Show emerald for new places
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

  // Size hierarchy based on place type
  const getMarkerSize = (type?: string) => {
    switch (type) {
      case "country":
        return 52;
      case "region":
        return 46;
      case "city":
        return 40;
      case "neighborhood":
        return 34;
      case "sight":
        return 28;
      default:
        return 40;
    }
  };

  return {
    color: isSelected ? "#e11d48" : typeColor, // Use rose-600 for selected markers
    ratingColor: getRatingColor(rating),
    size: getMarkerSize(type),
  };
};

export const createMarkerHtml = (
  style: ReturnType<typeof getMarkerStyle>,
  place: MapPlace,
  isSelected?: boolean,
  isHovered?: boolean
) => {
  const rating = place.averageRating ? place.averageRating.toFixed(1) : null;
  const scale = isSelected ? (isHovered ? 1.25 : 1.2) : isHovered ? 1.05 : 1;

  return `<div class="place-marker-container" style="
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: scale(${scale});
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  ">
    <div class="place-marker-label" style="
      position: absolute;
      top: -26px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${style.color}${isHovered ? "" : "ee"};
      color: #ffffff;
      padding: ${isHovered ? "4px 12px" : "3px 10px"};
      border-radius: 8px;
      font-family: ui-rounded, -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;
      box-shadow: 0 ${isHovered ? "4px 12px" : "2px 8px"} rgba(0,0,0,${
    isHovered ? "0.15" : "0.12"
  });
      white-space: nowrap;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      backdrop-filter: blur(8px);
      -webkit-font-smoothing: antialiased;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      ${place.name}
    </div>
    <div class="place-marker-wrapper" style="
      position: relative;
      width: ${style.size}px;
      height: ${style.size}px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      <div class="place-marker" style="
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${style.ratingColor};
        border-radius: 50%;
        box-shadow: 0 ${isHovered ? "4px 12px" : "2px 4px"} rgba(0,0,0,${
    isHovered ? "0.2" : "0.15"
  });
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        ${
          rating
            ? `<div style="
                font-size: ${rating.length > 2 ? "13px" : "14px"};
                font-weight: 600;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
              ">${rating}</div>`
            : `<div style="
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
              ">✨</div>`
        }
      </div>
    </div>
  </div>`;
};
