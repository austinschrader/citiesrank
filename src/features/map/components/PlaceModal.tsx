import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMap } from "@/features/map/context/MapContext";
import { MapPlace } from "@/features/map/types";
import { useFavoriteStatus } from "@/features/places/hooks/useFavoriteStatus";
import { createSlug } from "@/features/places/utils/placeUtils";
import { getPlaceImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LucideIcon, Star } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SaveCollectionsDialog } from "./SaveCollectionsDialog";
import { SocialShareMenu } from "./SocialShareMenu";

interface PlaceModalProps {
  place: MapPlace;
  isOpen: boolean;
  onClose: () => void;
  onPlaceSelect?: (place: MapPlace) => void;
}

interface StatBadgeProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_UP_THRESHOLD = 100;

interface TouchStartState {
  x: number;
  y: number;
  timestamp: number;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place: initialPlace,
  isOpen,
  onClose,
  onPlaceSelect,
}) => {
  const navigate = useNavigate();
  const [currentPlace, setCurrentPlace] = useState<MapPlace>(initialPlace);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [touchStart, setTouchStart] = useState<TouchStartState | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isRandomMode, setIsRandomMode] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const contentRef = useRef<HTMLDivElement>(null);
  const { visiblePlacesInView } = useMap();
  const { isFavorited } = useFavoriteStatus(currentPlace.id);
  const { user } = useAuth();

  const [lastTap, setLastTap] = useState(0);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  const handleDoubleTap = (e: React.TouchEvent) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
      // Double tap detected
      e.preventDefault();
      if (user) {
        setShowSaveDialog(true);
      }
    }

    setLastTap(currentTime);
  };

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const images = Array.from({ length: 4 }, (_, i) => {
        if (currentPlace.type === "city") {
          // For cities, use the format: paris-france-1, paris-france-2, etc.
          const baseUrl = currentPlace.imageUrl.replace(/-\d+$/, "");
          return getPlaceImage(
            `${baseUrl}-${i + 1}`,
            isMobile ? "mobile" : "wide"
          );
        } else {
          // For non-cities, append -1, -2, etc. to the base imageUrl
          // TODO get 4 images for non-cities
          return getPlaceImage(
            currentPlace.imageUrl,
            isMobile ? "mobile" : "wide"
          );
        }
      });

      await Promise.all(
        images.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.src = url;
          });
        })
      );

      setPreloadedImages(images);
    };

    loadImages();
  }, [currentPlace, isMobile]);

  const navigateToPlace = (direction: "next" | "prev") => {
    setIsTransitioning(true);
    const isNext = direction === "next";
    setDirection(isNext ? 1 : -1);

    const currentIndex = visiblePlacesInView.findIndex(
      (p) => p.id === currentPlace.id
    );

    let nextPlace: MapPlace;
    if (isRandomMode) {
      // Get random place excluding current one
      const availablePlaces = visiblePlacesInView.filter(
        (_, i) => i !== currentIndex
      );
      const randomIndex = Math.floor(Math.random() * availablePlaces.length);
      nextPlace = availablePlaces[randomIndex];
    } else {
      const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
      nextPlace = visiblePlacesInView[nextIndex];
    }

    if (nextPlace) {
      setTimeout(() => {
        setCurrentPlace(nextPlace);
        setCurrentImageIndex(0);
        setIsTransitioning(false);
        onPlaceSelect?.(nextPlace);
      }, 300);
    } else {
      setIsTransitioning(false);
    }
  };

  const navigateImages = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % preloadedImages.length);
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? preloadedImages.length - 1 : prev - 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          navigateImages("prev");
          e.preventDefault();
          break;
        case "ArrowRight":
          navigateImages("next");
          e.preventDefault();
          break;
        case "ArrowUp":
          onClose();
          e.preventDefault();
          break;
        case "Escape":
          onClose();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, navigateImages, onClose]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      timestamp: Date.now(),
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || e.touches.length !== 1) return;

    const xDiff = touchStart.x - e.touches[0].clientX;
    const yDiff = touchStart.y - e.touches[0].clientY;
    const timeDiff = Date.now() - touchStart.timestamp;
    const velocity = Math.abs(xDiff / timeDiff);

    // Handle horizontal swipes for image navigation
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (Math.abs(xDiff) > SWIPE_THRESHOLD || velocity > 0.5) {
        if (xDiff > 0) {
          navigateImages("next");
        } else {
          navigateImages("prev");
        }
        setTouchStart(null);
      }
    }
    // Handle vertical swipe up for closing
    else if (
      yDiff > SWIPE_UP_THRESHOLD &&
      Math.abs(xDiff) < SWIPE_THRESHOLD / 2
    ) {
      onClose();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const StatBadge: React.FC<StatBadgeProps> = ({
    icon: Icon,
    value,
    label,
    color,
  }) => (
    <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
      <Icon className={cn("w-4 h-4", color)} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{value}</span>
        <span className="text-xs text-white/70">{label}</span>
      </div>
    </div>
  );

  const currentIndex = visiblePlacesInView.findIndex(
    (p) => p.id === currentPlace.id
  );
  const isFirstPlace = currentIndex === 0;
  const isLastPlace = currentIndex === visiblePlacesInView.length - 1;

  const handleViewDetails = () => {
    navigate(`/places/${currentPlace.type}/${createSlug(currentPlace.name)}`, {
      state: { placeData: currentPlace },
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className={cn(
            "max-w-none w-screen h-screen p-0 m-0 bg-black/95 overflow-hidden",
            "data-[state=open]:slide-in-from-bottom-full",
            "sm:data-[state=open]:slide-in-from-bottom-0"
          )}
        >
          <div
            className="relative h-full w-full z-9999"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Content */}
            <div
              ref={contentRef}
              className={cn(
                "h-full w-full transition-all duration-300",
                isTransitioning && direction === 1 && "opacity-0 scale-95",
                isTransitioning && direction === -1 && "opacity-0 scale-95"
              )}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {preloadedImages[currentImageIndex] && (
                  <div
                    className="relative w-full h-full overflow-hidden"
                    onTouchStart={handleDoubleTap}
                  >
                    <img
                      src={preloadedImages[currentImageIndex]}
                      alt={currentPlace.name}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-300",
                        direction === 1 &&
                          isTransitioning &&
                          "translate-x-full",
                        direction === -1 &&
                          isTransitioning &&
                          "-translate-x-full"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  </div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="absolute inset-x-0 top-0 z-20 px-5">
                {/* Title Section */}
                <div className="flex flex-col pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <SocialShareMenu place={currentPlace} />
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSaveDialog(true)}
                          className={cn(
                            "h-7 bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-200",
                            isFavorited && "bg-white/20"
                          )}
                        >
                          <Star
                            className={cn(
                              "w-3 h-3 mr-1",
                              isFavorited && "fill-white"
                            )}
                          />
                          <span className="text-xs">
                            {isFavorited ? "Saved" : "Save"}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <h1
                      onClick={handleViewDetails}
                      className="text-3xl font-bold text-white leading-tight cursor-pointer hover:underline select-none"
                    >
                      {currentPlace.name}
                    </h1>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium text-white">
                        {currentPlace.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Navigation - Center (Hidden on mobile) */}
              <div className="absolute inset-y-0 left-4 right-4 hidden sm:flex items-center justify-between pointer-events-none">
                <Button
                  variant="ghost"
                  className="pointer-events-auto group bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20 text-white rounded-full h-8"
                  onClick={() => navigateImages("prev")}
                >
                  <div className="flex items-center gap-2 px-2">
                    <ChevronLeft className="w-4 h-4 text-white" />
                    <span className="text-xs hidden group-hover:inline text-white whitespace-nowrap">
                      Previous Photo
                    </span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="pointer-events-auto group bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20 text-white rounded-full h-8"
                  onClick={() => navigateImages("next")}
                >
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xs hidden group-hover:inline text-white whitespace-nowrap">
                      Next Photo
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </div>

              {/* Bottom Navigation Area */}
              <div className="absolute inset-x-0 bottom-0 pb-5">
                {/* Image Navigation Dots */}
                <div className="flex justify-center mb-3">
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                    {preloadedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-200",
                          currentImageIndex === index
                            ? "bg-white w-2.5"
                            : "bg-white/50 hover:bg-white/75"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Place Navigation */}
                <div className="px-5 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <button
                      onClick={() => setIsRandomMode(!isRandomMode)}
                      className={cn(
                        "text-xs px-3 py-1 rounded-full transition-colors",
                        isRandomMode
                          ? "bg-white text-black/80 hover:bg-white/90"
                          : "bg-black/40 text-white hover:bg-black/50"
                      )}
                    >
                      {isRandomMode ? "Random On" : "Random Off"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-3 rounded-full transition-colors",
                        !isRandomMode && isFirstPlace
                          ? "bg-white/5 text-white/40 cursor-not-allowed"
                          : "bg-white/10 text-white hover:bg-white/20 active:bg-white/30"
                      )}
                      onClick={() => navigateToPlace("prev")}
                      disabled={!isRandomMode && isFirstPlace}
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">Previous Place</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-3 rounded-full transition-colors",
                        !isRandomMode && isLastPlace
                          ? "bg-white/5 text-white/40 cursor-not-allowed"
                          : "bg-white/10 text-white hover:bg-white/20 active:bg-white/30"
                      )}
                      onClick={() => navigateToPlace("next")}
                      disabled={!isRandomMode && isLastPlace}
                    >
                      <span className="text-xs">Next Place</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Collections Dialog */}
      <SaveCollectionsDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        placeId={currentPlace.id}
      />
    </>
  );
};

export default PlaceModal;
