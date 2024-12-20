import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { MapPlace } from "@/features/map/types";
import { useFavoriteStatus } from "@/features/places/hooks/useFavoriteStatus";
import { useRelatedPlaces } from "@/features/places/hooks/useRelatedPlaces";
import { getPlaceImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
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

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place: initialPlace,
  isOpen,
  onClose,
  onPlaceSelect,
}) => {
  const [currentPlace, setCurrentPlace] = useState<MapPlace>(initialPlace);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedPlaces, setLoadedPlaces] = useState<MapPlace[]>([initialPlace]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { isFavorited, refresh } = useFavoriteStatus(currentPlace.id);
  const { user } = useAuth();
  const { relatedPlaces } = useRelatedPlaces(currentPlace);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const images = Array.from({ length: 4 }, (_, i) => {
        const baseUrl = currentPlace.imageUrl.replace(/-\d+$/, "");
        return getPlaceImage(`${baseUrl}-${i + 1}`, "wide");
      });

      // Preload images
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || isTransitioning) return;

    const xDiff = touchStart.x - e.touches[0].clientX;
    const yDiff = touchStart.y - e.touches[0].clientY;

    // Handle horizontal swipes for navigation
    if (
      Math.abs(xDiff) > Math.abs(yDiff) &&
      Math.abs(xDiff) > SWIPE_THRESHOLD
    ) {
      if (xDiff > 0 && relatedPlaces.length > 0) {
        navigateToPlace("next");
      } else if (xDiff < 0 && loadedPlaces.length > 1) {
        navigateToPlace("prev");
      }
      setTouchStart(null);
    }
    // Handle vertical swipe up for closing
    else if (yDiff > SWIPE_UP_THRESHOLD) {
      onClose();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
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

  const navigateToPlace = (direction: "next" | "prev") => {
    setIsTransitioning(true);
    const isNext = direction === "next";
    setDirection(isNext ? 1 : -1);

    let nextPlace: MapPlace;
    if (isNext && relatedPlaces.length > 0) {
      nextPlace = relatedPlaces[0];
      setLoadedPlaces((prev) => [...prev, nextPlace]);
    } else {
      const currentIndex = loadedPlaces.findIndex(
        (p) => p.id === currentPlace.id
      );
      nextPlace = loadedPlaces[currentIndex - 1];
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl p-0 gap-0 h-[100vh] sm:h-[100vh] w-full bg-black/95">
          <div
            className="relative h-full w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Main Content */}
            <div
              ref={contentRef}
              className={cn(
                "h-full w-full transition-transform duration-300",
                isTransitioning && direction === 1 && "translate-x-[-100%]",
                isTransitioning && direction === -1 && "translate-x-[100%]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Image Navigation Dots */}
              <div className="absolute top-4 inset-x-0 flex justify-center gap-1">
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

              {/* Image Navigation Buttons */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/70 hover:text-white transition-all duration-200"
                onClick={() => navigateImages("prev")}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/70 hover:text-white transition-all duration-200"
                onClick={() => navigateImages("next")}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Side Navigation for Places */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between items-center pointer-events-none">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 pointer-events-auto hidden sm:flex"
                  onClick={() => navigateToPlace("prev")}
                  disabled={
                    loadedPlaces.findIndex((p) => p.id === currentPlace.id) ===
                    0
                  }
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 pointer-events-auto hidden sm:flex"
                  onClick={() => navigateToPlace("next")}
                  disabled={relatedPlaces.length === 0}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </Button>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 space-y-6">
                {/* Place Title & Actions */}
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
                            isFavorited ? "fill-white text-white" : "text-white"
                          )}
                        />
                      </Button>
                    )}
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
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm">
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
