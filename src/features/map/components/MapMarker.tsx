import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPlaceImageBySlug } from "@/lib/bunny";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import L from "leaflet";
import { ArrowUpRight, Badge, Heart, Star } from "lucide-react";
import { useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapMarkerProps, MapPlace } from "../types";
import { useSelection } from "../context/SelectionContext";

interface PlacePopupCardProps {
  place: MapPlace;
  onSelect?: (place: MapPlace) => void;
}

const getMarkerStyle = (type?: string, rating?: number, isSelected?: boolean) => {
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
    color: isSelected ? "#e11d48" : typeColor, // Use rose-600 for selected markers
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

const PlacePopupCard = ({ place, onSelect }: PlacePopupCardProps) => {
  const { selectedPlace } = useSelection();
  const imageUrl = getPlaceImageBySlug(place.imageUrl, 1, "thumbnail");
  const isSelected = selectedPlace?.slug === place.slug;

  return (
    <div
      className="cursor-pointer"
      onClick={() => onSelect?.(place)}
    >
      <Card className={`w-[300px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ${
        isSelected ? "ring-2 ring-rose-500" : ""
      }`}>
        {/* Image Container with Like Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          {imageUrl && (
            <div className="relative group">
              <img
                src={imageUrl}
                alt={place.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button 
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking heart
              >
                <Heart className="w-4 h-4 text-gray-700 hover:text-rose-500 transition-colors duration-200" />
              </button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {place.name}
              </h3>
            </div>

            {/* Rating and Type */}
            <div className="flex items-center gap-2">
              {place.averageRating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {place.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
              {place.type && <Badge className="text-xs">{place.type}</Badge>}
            </div>
          </div>

          {/* Description or Additional Info */}
          {place.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {place.description}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const MapMarker = ({ place, onSelect, isSelected }: MapMarkerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedPlace, setSelectedPlace } = useSelection();
  const isPlaceSelected = selectedPlace?.slug === place.slug;

  const markerStyle = getMarkerStyle(place.type, place.averageRating, isPlaceSelected);
  const markerHtml = createMarkerHtml(markerStyle, place, isPlaceSelected, isHovered);
  const icon = L.divIcon({
    className: "custom-marker",
    html: markerHtml,
    iconSize: [markerStyle.size, markerStyle.size],
    iconAnchor: [markerStyle.size / 2, markerStyle.size / 2],
  });

  const handleMarkerClick = () => {
    setSelectedPlace(place);
    onSelect?.(place);
    setIsHovered(true);
  };

  return (
    <Marker
      ref={null}
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
        offset={[0, -markerStyle.size / 2]}
        closeButton={false}
        eventHandlers={{
          remove: () => {
            setIsHovered(false);
            setSelectedPlace(null);
          },
        }}
      >
        <PlacePopupCard place={place} onSelect={onSelect} />
      </Popup>
    </Marker>
  );
};

export default MapMarker;
