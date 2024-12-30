import { Button } from "@/components/ui/button";
import { getPlaceImageBySlug } from "@/lib/bunny";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import L from "leaflet";
import { Star } from "lucide-react";
import { useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapMarkerProps, MapPlace } from "../types";

// Helper functions
const getMarkerStyle = (type?: string, rating?: number) => {
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

  return {
    color: typeColor,
    ratingColor: getRatingColor(rating),
    size: 40,
  };
};

const createMarkerHtml = (
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

export const MapMarker = ({ place, onSelect, isSelected }: MapMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const markerRef = useRef(null);

  const style = getMarkerStyle(place.type, place.averageRating);
  const markerHtml = createMarkerHtml(style, place, isSelected, isHovered);
  const icon = L.divIcon({
    className: "custom-marker",
    html: markerHtml,
    iconSize: [style.size, style.size],
    iconAnchor: [style.size / 2, style.size / 2],
  });

  const handleMarkerClick = () => {
    onSelect?.(place);
    setIsPopupOpen(true);
  };

  console.log(getPlaceImageBySlug(place.imageUrl, 1, "thumbnail"));

  return (
    <Marker
      ref={markerRef}
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={{
        click: handleMarkerClick,
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Popup
        className="custom-popup"
        offset={[0, -style.size / 2]}
        eventHandlers={{
          remove: () => setIsPopupOpen(false),
        }}
      >
        <div className="flex flex-col p-2 min-w-[200px]">
          {/* {place.images?.[0] && ( */}
          {place.imageUrl && (
            <img
              src={getPlaceImageBySlug(place.imageUrl, 1, "thumbnail")}
              alt={place.name}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
          )}
          <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
          {place.averageRating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{place.averageRating.toFixed(1)}</span>
            </div>
          )}
          <Button
            variant="default"
            className="mt-2"
            onClick={() => onSelect?.(place)}
          >
            View Details
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
