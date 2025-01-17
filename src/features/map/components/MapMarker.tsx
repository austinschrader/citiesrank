import { ImageGallery } from "@/components/gallery/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PhotoUploadDialog } from "@/features/photos/components/PhotoUploadDialog";
import { pb } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import L from "leaflet";
import { Check, FolderPlus, MapPin } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Marker, Popup, useMap as useLeafletMap } from "react-leaflet";
import { useSelection } from "../context/SelectionContext";
import { MapMarkerProps, MapPlace } from "../types";
import { SaveCollectionsDialog } from "./SaveCollectionsDialog";
import { PlaceModal } from "./PlaceModal";

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
          {/* Image */}
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
                variant="outline"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
              >
                {place.type}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{place.name}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={isSaved ? "secondary" : "outline"}
                  size="sm"
                  onClick={onOpenCollectionsDialog}
                  className={cn(
                    "transition-all duration-200",
                    isSaved && "bg-green-50 text-green-600 hover:bg-green-100"
                  )}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLocate}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Locate
                </Button>
                <Button size="sm" onClick={handleDetailsClick}>
                  View Details
                </Button>
              </div>
            </div>

            {/* Social Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>📸</span>
                <span>24 photos</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐️</span>
                <span>4.8 (126 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>89 visitors</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onOpenPhotoDialog}
              >
                📸 Add Photo
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                ✍️ Write Review
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Sarah added a photo • 2h ago
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                  <span className="text-muted-foreground">
                    Mike wrote a review • 5h ago
                  </span>
                </div>
              </div>
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
  const [isCollectionsDialogOpen, setIsCollectionsDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;

      try {
        // First get all lists that contain this place
        const listPlaces = await pb.collection("list_places").getList(1, 1, {
          filter: `place = "${place.id}" && list.user = "${user.id}"`,
          expand: "list",
          $autoCancel: false,
        });

        setIsSaved(listPlaces.totalItems > 0);
      } catch (error) {
        console.error("Error checking if place is saved:", error);
      }
    };

    checkIfSaved();
  }, [place.id, user]);

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

  return (
    <>
      <Marker
        position={[place.latitude, place.longitude]}
        icon={icon}
        eventHandlers={{
          click: (e) => {
            e.originalEvent.stopPropagation();
            setSelectedPlace(place, true);
          },
        }}
      >
        <Popup closeButton={false} className="place-popup" offset={[0, -20]}>
          <PlacePopupCard
            place={place}
            onOpenCollectionsDialog={() => setIsCollectionsDialogOpen(true)}
            onOpenPhotoDialog={() => setIsPhotoDialogOpen(true)}
            isSaved={isSaved}
          />
        </Popup>
      </Marker>

      {isCollectionsDialogOpen &&
        createPortal(
          <SaveCollectionsDialog
            isOpen={isCollectionsDialogOpen}
            onClose={() => {
              setIsCollectionsDialogOpen(false);
              if (user) {
                pb.collection("list_places")
                  .getList(1, 1, {
                    filter: `place = "${place.id}" && list.user = "${user.id}"`,
                    expand: "list",
                    $autoCancel: false,
                  })
                  .then((result) => {
                    setIsSaved(result.totalItems > 0);
                  });
              }
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

export default MapMarker;
