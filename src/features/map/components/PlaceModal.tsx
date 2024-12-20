import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMap } from "@/features/map/context/MapContext";
import { MapPlace } from "@/features/map/types";
import { useFavoriteStatus } from "@/features/places/hooks/useFavoriteStatus";
import { createSlug } from "@/features/places/utils/placeUtils";
import { getPlaceImage } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Info,
  LucideIcon,
  MapPin,
  Shuffle,
  Star,
  X,
} from "lucide-react";
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

interface TouchStartState {
  x: number;
  y: number;
  timestamp: number;
}

interface StatBadgeProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: string;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_UP_THRESHOLD = 100;
const DOUBLE_TAP_DELAY = 300;

interface NavigationState {
  direction: -1 | 0 | 1;
  isRandomMode: boolean;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place: initialPlace,
  isOpen,
  onClose,
  onPlaceSelect,
}) => {
  const navigate = useNavigate();
  const [currentPlace, setCurrentPlace] = useState<MapPlace>(initialPlace);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState<TouchStartState | null>(null);
  const [lastTap, setLastTap] = useState(0);
  const [navigation, setNavigation] = useState<NavigationState>({
    direction: 0,
    isRandomMode: false,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [showHints, setShowHints] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const { visiblePlacesInView } = useMap();
  const { isFavorited } = useFavoriteStatus(currentPlace.id);
  const { user } = useAuth();

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Image preloading
  useEffect(() => {
    const loadImages = async () => {
      const images = Array.from({ length: 4 }, (_, i) =>
        getPlaceImage(
          currentPlace.type === "city"
            ? `${currentPlace.imageUrl.replace(/-\d+$/, "")}-${i + 1}`
            : currentPlace.imageUrl,
          isMobile ? "mobile" : "wide"
        )
      );

      await Promise.all(
        images.map((url) => {
          const img = new Image();
          img.src = url;
          return new Promise<string>((resolve) => {
            img.onload = () => resolve(url);
          });
        })
      );

      setPreloadedImages(images);
    };

    loadImages();
  }, [currentPlace, isMobile]);

  // Hide hints after delay
  useEffect(() => {
    if (showHints) {
      const timer = setTimeout(() => {
        setShowHints(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showHints]);

  // Reset hints when modal reopens
  useEffect(() => {
    if (isOpen) {
      setShowHints(true);
    }
  }, [isOpen]);

  // Touch handlers
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
        handleImageNavigation(xDiff > 0 ? "next" : "prev");
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

  const handleDoubleTap = (e: React.TouchEvent) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
      e.preventDefault();
      if (user) {
        setShowSaveDialog(true);
      }
    }

    setLastTap(currentTime);
  };

  const handleImageNavigation = (direction: "next" | "prev") => {
    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % preloadedImages.length
        : currentImageIndex === 0
        ? preloadedImages.length - 1
        : currentImageIndex - 1;

    setCurrentImageIndex(newIndex);
  };

  const handleDetailsView = () => {
    navigate(`/places/${currentPlace.type}/${createSlug(currentPlace.name)}`, {
      state: { placeData: currentPlace },
    });
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          handleImageNavigation("prev");
          e.preventDefault();
          break;
        case "ArrowRight":
          handleImageNavigation("next");
          e.preventDefault();
          break;
        case "ArrowUp":
        case "Escape":
          onClose();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose, handleImageNavigation]);

  const navigateToPlace = (direction: "next" | "prev") => {
    setIsTransitioning(true);
    const isNext = direction === "next";
    setNavigation((prev) => ({ ...prev, direction: isNext ? 1 : -1 }));

    const currentIndex = visiblePlacesInView.findIndex(
      (p) => p.id === currentPlace.id
    );

    let nextPlace: MapPlace;
    if (navigation.isRandomMode) {
      // Get random place excluding current one
      const availablePlaces = visiblePlacesInView.filter(
        (_, i) => i !== currentIndex
      );
      const randomIndex = Math.floor(Math.random() * availablePlaces.length);
      nextPlace = availablePlaces[randomIndex];
    } else {
      const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
      // Handle wrapping around at the ends
      if (nextIndex < 0) {
        nextPlace = visiblePlacesInView[visiblePlacesInView.length - 1];
      } else if (nextIndex >= visiblePlacesInView.length) {
        nextPlace = visiblePlacesInView[0];
      } else {
        nextPlace = visiblePlacesInView[nextIndex];
      }
    }

    if (nextPlace) {
      setTimeout(() => {
        setCurrentPlace(nextPlace);
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
    color = "text-white",
  }) => (
    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
      <Icon className={cn("w-4 h-4", color)} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{value}</span>
        <span className="text-xs text-white/70">{label}</span>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm 
            data-[state=open]:animate-in data-[state=closed]:animate-out 
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          className="fixed inset-0 z-50 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-full w-full" ref={contentRef}>
            {/* Main Image Container */}
            <div className="absolute inset-0" onTouchStart={handleDoubleTap}>
              {preloadedImages[currentImageIndex] && (
                <div className="relative h-full">
                  <img
                    src={preloadedImages[currentImageIndex]}
                    alt={currentPlace.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
              )}
            </div>

            {/* Header Navigation */}
            <div className="absolute top-0 inset-x-0 p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md 
                    hover:bg-black/50 border border-white/20"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowHints(false); // Reset first
                      setTimeout(() => setShowHints(true), 0); // Then show on next tick
                    }}
                    className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md 
                      hover:bg-black/50 border border-white/20"
                  >
                    <Info className="h-5 w-5 text-white" />
                  </Button>
                  <SocialShareMenu place={currentPlace} />
                  {user && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSaveDialog(true)}
                      className={cn(
                        "h-10 w-10 rounded-full transition-all duration-300",
                        isFavorited
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 text-white",
                          isFavorited && "fill-white"
                        )}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Place Information */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
              {/* Mobile Navigation Controls */}
              {isMobile && (
                <div className="flex flex-col items-center gap-2 mb-4">
                  {/* Usage Hints */}
                  <div
                    className={cn(
                      "text-white/80 text-xs flex flex-col items-center gap-1.5 transition-opacity duration-500",
                      showHints
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="font-medium">Swipe to navigate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    {user && (
                      <span className="font-medium">Double tap to save</span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
                  <span className="text-xs sm:text-sm text-white/80">
                    {currentPlace.country || "Location details"}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <Button
                    variant="ghost"
                    className="text-xl sm:text-2xl font-bold text-white leading-tight px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
                    onClick={handleDetailsView}
                  >
                    {currentPlace.name}
                  </Button>
                  {currentPlace.averageRating && (
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium text-white">
                        {currentPlace.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {currentPlace.description && (
                  <p className="text-sm sm:text-base text-white/90 max-w-2xl line-clamp-2">
                    {currentPlace.description}
                  </p>
                )}
              </div>

              {/* Image Navigation */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">
                    {preloadedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          currentImageIndex === index
                            ? "bg-white w-4"
                            : "bg-white/50 hover:bg-white/80"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/80">
                    <Camera className="h-4 w-4 inline-block mr-1.5" />
                    {currentImageIndex + 1} / {preloadedImages.length}
                  </span>
                </div>
              </div>

              {/* Mobile Previous/Next Buttons */}
              {isMobile && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-center justify-between w-full gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 active:bg-white/20 border border-white/20 [&:not(:disabled)]:text-white transition-all duration-200"
                      onClick={() => {
                        setNavigation((prev) => ({ ...prev, direction: -1 }));
                        navigateToPlace("prev");
                      }}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Place
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setNavigation((prev) => ({
                          ...prev,
                          isRandomMode: !prev.isRandomMode,
                        }))
                      }
                      className={cn(
                        "h-9 w-9 rounded-full backdrop-blur-md border border-white/20",
                        navigation.isRandomMode
                          ? "bg-white/20 text-white hover:bg-white/30"
                          : "bg-black/30 hover:bg-black/50"
                      )}
                    >
                      <Shuffle className="h-4 w-4 text-white" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 active:bg-white/20 border border-white/20 [&:not(:disabled)]:text-white transition-all duration-200"
                      onClick={() => {
                        setNavigation((prev) => ({ ...prev, direction: 1 }));
                        navigateToPlace("next");
                      }}
                    >
                      Next Place
                      {navigation.isRandomMode ? (
                        <Shuffle className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Side Navigation - Desktop Only */}
            <div className="absolute inset-y-0 left-4 right-4 hidden lg:flex items-center justify-between pointer-events-none">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateToPlace("prev")}
                className="pointer-events-auto h-12 w-12 rounded-full bg-black/20 
                  backdrop-blur-md hover:bg-black/40 border border-white/10"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateToPlace("next")}
                className="pointer-events-auto h-12 w-12 rounded-full bg-black/20 
                  backdrop-blur-md hover:bg-black/40 border border-white/10"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      <SaveCollectionsDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        placeId={currentPlace.id}
      />
    </Dialog.Root>
  );
};
