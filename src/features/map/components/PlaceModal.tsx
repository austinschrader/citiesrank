/**
 * Modal for displaying place details with image gallery and navigation.
 * Navigation logic handled by usePlaceNavigation hook.
 * Dependencies: MapContext, SavedPlacesContext
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogPortal } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSavedPlaces } from "@/features/lists/context/SavedPlacesContext";
import { useMap } from "@/features/map/context/MapContext";
import { MapPlace } from "@/features/map/types";
import { getImageUrl } from "@/lib/bunny";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Shuffle,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaceNavigation } from "../hooks/usePlaceNavigation";
import { SaveCollectionsDialog } from "./SaveCollectionsDialog";
import { SocialShareMenu } from "./SocialShareMenu";

interface PlaceModalProps {
  place: MapPlace;
  isOpen: boolean;
  onClose: () => void;
  onPlaceSelect?: (place: MapPlace) => void;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({
  place: initialPlace,
  isOpen,
  onClose,
  onPlaceSelect,
}) => {
  const navigate = useNavigate();
  const { visiblePlacesInView } = useMap();
  const { user } = useAuth();
  const { currentPlace, navigation, toggleRandomMode, navigateToPlace } =
    usePlaceNavigation(initialPlace, visiblePlacesInView);
  const { isPlaceSaved, refreshSavedPlaces } = useSavedPlaces();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const contentRef = useRef<HTMLDivElement>(null);

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
      const base = currentPlace.imageUrl
        .replace(/^places\//, "")
        .replace(/-\d+$/, "");
      const loadedImages: string[] = [];

      // Try loading images until we get a failure
      for (let i = 1; i <= 4; i++) {
        const url = getImageUrl(`${base}-${i}`);
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              loadedImages.push(url);
              resolve();
            };
            img.onerror = reject;
            img.src = url;
          });
        } catch {
          // Stop when we hit a 404
          break;
        }
      }

      setPreloadedImages(loadedImages);
    };

    loadImages();
  }, [currentPlace, isMobile]);

  // Only auto-hide hints on mobile
  useEffect(() => {
    if (showHints && isMobile) {
      const timer = setTimeout(() => {
        setShowHints(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showHints, isMobile]);

  useEffect(() => {
    setShowHints(true);
  }, [currentPlace?.id]);

  const handleImageNavigation = (direction: "next" | "prev") => {
    if (preloadedImages.length <= 1) return;

    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % preloadedImages.length
        : currentImageIndex === 0
        ? preloadedImages.length - 1
        : currentImageIndex - 1;

    setCurrentImageIndex(newIndex);
  };

  const handlePlaceNavigation = (direction: "next" | "prev") => {
    const nextPlace = navigateToPlace(direction);
    if (onPlaceSelect) {
      onPlaceSelect(nextPlace);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.shiftKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            handlePlaceNavigation("next");
            break;
          case "ArrowLeft":
            e.preventDefault();
            handlePlaceNavigation("prev");
            break;
        }
      } else {
        switch (e.key) {
          case "ArrowRight":
            handleImageNavigation("next");
            break;
          case "ArrowLeft":
            handleImageNavigation("prev");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    preloadedImages.length,
    handlePlaceNavigation,
    handleImageNavigation,
    currentPlace.id,
    visiblePlacesInView,
    navigation.isRandomMode,
  ]);

  const handleDetailsView = () => {
    navigate(`/places/${currentPlace.type}/${currentPlace.slug}`, {
      state: { placeData: currentPlace },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
          <div
            ref={contentRef}
            className="relative w-full h-full overflow-hidden rounded-lg bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image Container */}
            <div className="absolute inset-0">
              {preloadedImages[currentImageIndex] && (
                <div className="relative h-full group">
                  {/* Navigation Areas - constrained to middle section */}
                  <div
                    className={cn(
                      "absolute inset-x-0 top-[15%] bottom-[25%] z-20 transition-opacity duration-1000 lg:hidden pointer-events-none",
                      showHints ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {/* Left navigation area */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("prev");
                      }}
                    >
                      <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                        <ChevronLeft className="h-12 w-12 text-white/90" />
                      </div>
                    </div>

                    {/* Right navigation area */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageNavigation("next");
                      }}
                    >
                      <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                        <ChevronRight className="h-12 w-12 text-white/90" />
                      </div>
                    </div>
                  </div>

                  <img
                    key={preloadedImages[currentImageIndex]}
                    src={preloadedImages[currentImageIndex]}
                    alt={currentPlace.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHints(true);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (user) {
                        setShowSaveDialog(true);
                      }
                    }}
                    className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
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
                  className="h-10 w-10 rounded-full bg-transparent backdrop-blur-md 
                    hover:bg-black/50"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHints(true);
                          }}
                          className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-2 py-1 h-auto hover:bg-black/50"
                        >
                          <Camera className="h-3.5 w-3.5 text-white/80" />
                          <span className="text-sm text-white/80 tabular-nums">
                            {currentImageIndex + 1}/{preloadedImages.length}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-3 bg-black/80 backdrop-blur-md"
                        align="center"
                        sideOffset={5}
                      >
                        <div className="flex gap-2 items-center">
                          {preloadedImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                currentImageIndex === index
                                  ? "bg-white w-6"
                                  : "bg-white/50 hover:bg-white/80"
                              )}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <SocialShareMenu place={currentPlace} />
                    {user && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSaveDialog(true)}
                        className={cn(
                          "h-10 w-10 rounded-full transition-all duration-300 backdrop-blur-md group",
                          isPlaceSaved(currentPlace.id)
                            ? "bg-primary/20 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40"
                            : "bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30"
                        )}
                      >
                        <Bookmark
                          className={cn(
                            "h-5 w-5 transition-all duration-300 ease-spring",
                            isPlaceSaved(currentPlace.id)
                              ? "text-primary fill-primary scale-110"
                              : "text-white/90 group-hover:scale-110"
                          )}
                        />
                        <span
                          className={cn(
                            "absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 scale-95 transition-all duration-200",
                            "bg-black/80 text-white backdrop-blur-md",
                            "group-hover:opacity-100 group-hover:scale-100"
                          )}
                        >
                          {isPlaceSaved(currentPlace.id) ? "Saved" : "Save"}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Place Information */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white drop-shadow-sm" />
                  <span className="text-xs sm:text-sm font-medium text-white drop-shadow-sm">
                    {currentPlace.country || "Location details"}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <Button
                    variant="ghost"
                    className="text-xl sm:text-2xl font-bold text-white leading-tight px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/50"
                    onClick={handleDetailsView}
                  >
                    {currentPlace.name}
                  </Button>
                  {currentPlace.averageRating ? (
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full drop-shadow-sm">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium text-white">
                        {currentPlace.averageRating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full drop-shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span className="text-sm font-medium text-white">
                        New
                      </span>
                    </div>
                  )}
                </div>

                {currentPlace.description && (
                  <p className="text-sm sm:text-base text-white font-medium max-w-2xl drop-shadow-sm">
                    {currentPlace.description}
                  </p>
                )}
              </div>

              {/* Place Navigation */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center justify-between w-full gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 rounded-full bg-transparent backdrop-blur-md text-white hover:bg-black/50 active:bg-white/20"
                    onClick={() => handlePlaceNavigation("prev")}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Place
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleRandomMode}
                    className={cn(
                      "h-9 w-9 rounded-full backdrop-blur-md",
                      navigation.isRandomMode
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-transparent hover:bg-black/50"
                    )}
                  >
                    <Shuffle className="h-4 w-4 text-white" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 rounded-full bg-transparent backdrop-blur-md text-white hover:bg-black/50 active:bg-white/20"
                    onClick={() => handlePlaceNavigation("next")}
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
            </div>
            {/* Side Navigation - Desktop Only */}
            <div className="absolute inset-y-0 left-4 right-4 hidden lg:flex items-center justify-between pointer-events-none">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleImageNavigation("prev")}
                className="pointer-events-auto h-12 w-12 rounded-full bg-black/40 
                  backdrop-blur-sm hover:bg-black/50 border border-white/10"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleImageNavigation("next")}
                className="pointer-events-auto h-12 w-12 rounded-full bg-black/40 
                  backdrop-blur-sm hover:bg-black/50 border border-white/10"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>

      <SaveCollectionsDialog
        isOpen={showSaveDialog}
        onClose={() => {
          setShowSaveDialog(false);
          refreshSavedPlaces();
        }}
        placeId={currentPlace.id}
      />
    </Dialog>
  );
};
