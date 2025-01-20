import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSavedPlaces } from "@/features/lists/context/SavedPlacesContext";
import { PhotoUploadDialog } from "@/features/photos/components/PhotoUploadDialog";
import { cn } from "@/lib/utils";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import L from "leaflet";
import { Bookmark, FolderPlus, MapPin, Star } from "lucide-react";
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Marker, Popup, useMap as useLeafletMap } from "react-leaflet";
import { useSelection } from "../context/SelectionContext";
import { MapMarkerProps, MapPlace } from "../types";
import { PlaceModal } from "./PlaceModal";
import { SaveCollectionsDialog } from "./SaveCollectionsDialog";

interface PlacePopupCardProps {
  place: MapPlace;
  onOpenCollectionsDialog: () => void;
  onOpenPhotoDialog: () => void;
  isSaved?: boolean;
}

const getMarkerStyle = (
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

const PlacePopupCard: React.FC<PlacePopupCardProps> = ({
  place,
  onOpenCollectionsDialog,
  onOpenPhotoDialog,
  isSaved = false,
}) => {
  const { user } = useAuth();
  const map = useLeafletMap();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocate = () => {
    map.setView([place.latitude, place.longitude], 10, {
      animate: true,
      duration: 1,
    });
  };

  const handleDetailsClick = () => {
    window.open(`/#/places/${place.type}/${place.slug}`, "_blank");
  };

  const [showControls, setShowControls] = useState(false);

  return (
    <>
      <Card className="w-[300px]">
        <CardContent
          className="p-0 cursor-pointer"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            setIsModalOpen(true);
          }}
        >
          <div
            className="relative"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <ImageGallery
              imageUrl={place.imageUrl}
              cityName={place.name}
              country={place.country}
              showControls={showControls}
              variant="default"
              onImageClick={() => setIsModalOpen(true)}
            />
            {place.type && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 text-xs bg-black/50 text-white border-0"
              >
                {place.type}
              </Badge>
            )}
            {/* Tags overlay */}
            <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[70%]">
              {Array.isArray(place.tags) &&
                place.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-black/50 text-white border-0"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <div
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 rounded-full transition-all duration-300 flex items-center justify-center",
                isSaved
                  ? "bg-primary/20 dark:bg-primary/30"
                  : "bg-white/10 dark:bg-black/20"
              )}
            >
              <Bookmark
                className={cn(
                  "h-3 w-3 transition-all duration-300 ease-spring",
                  isSaved
                    ? "text-primary fill-primary scale-110"
                    : "text-white/90"
                )}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-2 space-y-1.5">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base leading-tight line-clamp-2">
                  {place.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="line-clamp-1">{place.country}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span>{place.averageRating?.toFixed(1) || "New"}</span>
                  </div>
                  <span>•</span>
                  <span>${place.cost}/day</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLocate}
                  className="h-6 w-6 p-0"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onOpenCollectionsDialog}
                  className="h-6 w-6 p-0"
                >
                  <FolderPlus
                    className={cn("w-3.5 h-3.5", {
                      "text-primary fill-primary": isSaved,
                    })}
                  />
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground">{place.description}</p>

            {/* Activity + View */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded p-1.5">
              <div className="flex -space-x-2 flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-indigo-400 flex items-center justify-center ring-1 ring-white">
                  <span className="text-[8px]">📸</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-purple-400 flex items-center justify-center ring-1 ring-white">
                  <span className="text-[8px]">⭐️</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                  2 new updates • Latest photo 2h ago
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleDetailsClick}
                className="h-5 px-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
              >
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <PlaceModal
        place={place}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

/**
 * file location: src/features/map/components/MapMarker.tsx
 * Renders an individual map marker with a popup. Uses SelectionContext for
 * marker selection state and PlacePopupCard for popup content.
 */
export const MapMarker: React.FC<MapMarkerProps> = React.memo(({ place }) => {
  const { selectedPlace, setSelectedPlace } = useSelection();
  const { user } = useAuth();
  const { isPlaceSaved, refreshSavedPlaces } = useSavedPlaces();
  const [isCollectionsDialogOpen, setIsCollectionsDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const map = useLeafletMap();

  const markerStyle = useMemo(
    () => getMarkerStyle(place.type, place.averageRating),
    [place.type, place.averageRating]
  );

  const markerHtml = useMemo(
    () => createMarkerHtml(markerStyle, place),
    [markerStyle, place]
  );

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "custom-marker",
        html: markerHtml,
        iconSize: [markerStyle.size, markerStyle.size],
        iconAnchor: [markerStyle.size / 2, markerStyle.size / 2],
      }),
    [markerHtml, markerStyle.size]
  );

  const click = (e: L.LeafletMouseEvent) => {
    e.originalEvent.stopPropagation();
    setSelectedPlace(place, true);

    // Get current map center and zoom
    const currentZoom = map.getZoom();

    // Calculate offset based on viewport height
    const viewportHeight = map.getSize().y;
    const verticalOffset = viewportHeight * 0.25; // 25% of viewport height

    // Calculate target point with offset
    const markerPoint = map.project(
      [place.latitude, place.longitude],
      currentZoom
    );
    const targetPoint = markerPoint.subtract([0, verticalOffset]);
    const targetLatLng = map.unproject(targetPoint, currentZoom);

    // Use flyTo for smoother animation
    map.flyTo(targetLatLng, currentZoom, {
      duration: 0.85, // slightly faster for more responsiveness
      easeLinearity: 0.25, // more pronounced easing
      noMoveStart: true, // prevents initial jerk
    });
  };

  return (
    <>
      <Marker
        position={[place.latitude, place.longitude]}
        icon={icon}
        eventHandlers={{
          click,
        }}
      >
        <Popup closeButton={false} className="place-popup" offset={[0, -20]}>
          <PlacePopupCard
            place={place}
            onOpenCollectionsDialog={() => setIsCollectionsDialogOpen(true)}
            onOpenPhotoDialog={() => setIsPhotoDialogOpen(true)}
            isSaved={isPlaceSaved(place.id)}
          />
        </Popup>
      </Marker>

      {isCollectionsDialogOpen &&
        createPortal(
          <SaveCollectionsDialog
            isOpen={isCollectionsDialogOpen}
            onClose={() => {
              setIsCollectionsDialogOpen(false);
              refreshSavedPlaces();
            }}
            placeId={place.id}
          />,
          document.body
        )}

      {isPhotoDialogOpen &&
        createPortal(
          <PhotoUploadDialog
            isOpen={isPhotoDialogOpen}
            onClose={() => setIsPhotoDialogOpen(false)}
            placeId={place.id}
            placeName={place.name}
          />,
          document.body
        )}
    </>
  );
});
