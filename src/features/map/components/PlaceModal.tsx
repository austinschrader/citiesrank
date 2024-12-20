import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMap } from "@/features/map/context/MapContext";
import { MapPlace } from "@/features/map/types";
import { useFavoriteStatus } from "@/features/places/hooks/useFavoriteStatus";
import { getPlaceImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  DollarSign,
  Globe,
  LucideIcon,
  Navigation,
  Shield,
  Star,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
  const [currentPlace, setCurrentPlace] = useState<MapPlace>(initialPlace);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [touchStart, setTouchStart] = useState<TouchStartState | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { visiblePlacesInView } = useMap();
  const { isFavorited } = useFavoriteStatus(currentPlace.id);
  const { user } = useAuth();

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const images = Array.from({ length: 4 }, (_, i) => {
        const baseUrl = currentPlace.imageUrl.replace(/-\d+$/, "");
        return getPlaceImage(`${baseUrl}-${i + 1}`, "wide");
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
  }, [currentPlace]);

  const navigateToPlace = (direction: "next" | "prev") => {
    setIsTransitioning(true);
    const isNext = direction === "next";
    setDirection(isNext ? 1 : -1);

    const currentIndex = visiblePlacesInView.findIndex(
      (p) => p.id === currentPlace.id
    );
    const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    const nextPlace = visiblePlacesInView[nextIndex];

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
    else if (yDiff > SWIPE_UP_THRESHOLD && Math.abs(xDiff) < SWIPE_THRESHOLD / 2) {
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl p-0 gap-0 h-[100vh] sm:h-[100vh] w-full bg-black/95 overflow-hidden">
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
                  <img
                    src={preloadedImages[currentImageIndex]}
                    alt={`${currentPlace.name} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              </div>

              {/* Place Navigation - Top */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-200 disabled:opacity-50"
                    onClick={() => navigateToPlace("prev")}
                    disabled={isFirstPlace}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm">Previous Place</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 bg-black/30 backdrop-blur-sm border border-white/20 text-white hover:bg-black/50 transition-all duration-200 disabled:opacity-50"
                    onClick={() => navigateToPlace("next")}
                    disabled={isLastPlace}
                  >
                    <span className="text-sm">Next Place</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <button className="transition-colors" onClick={onClose}>
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>

              {/* Image Navigation - Center */}
              <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  className="group bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20 text-white rounded-full h-9"
                  onClick={() => navigateImages("prev")}
                >
                  <div className="flex items-center gap-2 px-2">
                    <ChevronLeft className="w-4 h-4 text-white" />
                    <span className="text-sm hidden group-hover:inline text-white whitespace-nowrap">
                      Previous Photo
                    </span>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="group bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20 text-white rounded-full h-9"
                  onClick={() => navigateImages("next")}
                >
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-sm hidden group-hover:inline text-white whitespace-nowrap">
                      Next Photo
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </div>

              {/* Content Section - Bottom */}
              <div className="absolute inset-x-0 bottom-0 pb-6">
                {/* Image Navigation Dots */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                    {preloadedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-200",
                          currentImageIndex === index
                            ? "bg-white w-3"
                            : "bg-white/50 hover:bg-white/75"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="px-6 space-y-6">
                  {/* Title Section */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        {currentPlace.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Globe className="w-4 h-4 text-white/70" />
                        <p className="text-white/70">{currentPlace.country}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        {user && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20"
                            onClick={() => setShowSaveDialog(true)}
                          >
                            <Bookmark
                              className={cn(
                                "w-5 h-5",
                                isFavorited
                                  ? "fill-white text-white"
                                  : "text-white"
                              )}
                            />
                          </Button>
                        )}
                        <SocialShareMenu place={currentPlace} />
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatBadge
                      icon={Star}
                      value={currentPlace.averageRating?.toFixed(1) || "N/A"}
                      label="Rating"
                      color="text-yellow-500"
                    />
                    <StatBadge
                      icon={Users}
                      value={currentPlace.population?.toLocaleString() || "N/A"}
                      label="Population"
                      color="text-blue-500"
                    />
                    <StatBadge
                      icon={Shield}
                      value={currentPlace.safetyScore?.toFixed(1) || "N/A"}
                      label="Safety"
                      color="text-green-500"
                    />
                    <StatBadge
                      icon={DollarSign}
                      value={currentPlace.cost?.toFixed(1) || "N/A"}
                      label="Cost"
                      color="text-red-500"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-sm leading-relaxed max-w-3xl">
                    {currentPlace.description}
                  </p>

                  {/* Navigation Hint */}
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2 text-white/50 text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Navigation className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Navigate with arrow keys or swipe
                      </span>
                      <span className="sm:hidden">
                        Swipe to explore more places
                      </span>
                    </div>
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
