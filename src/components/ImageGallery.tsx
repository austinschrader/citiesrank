import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSlug } from "@/lib/imageUtils";
import { getImageUrl } from "@/lib/cloudinary";

interface ImageGalleryProps {
  cityName: string;
  country: string;
  showControls?: boolean;
  onImageClick?: () => void;
  variant?: "default" | "hero";
  priority?: boolean; // Add priority prop for hero images
}

export const ImageGallery = ({
  cityName,
  country,
  showControls = false,
  onImageClick,
  variant = "default",
  priority = false,
}: ImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loadedImages = useRef(new Set<string>());
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  const citySlug = useMemo(() => createSlug(cityName), [cityName]);
  const countrySlug = useMemo(() => createSlug(country), [country]);

  // Generate image URLs only once
  const images = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const baseUrl = `${citySlug}-${countrySlug}-${i + 1}`;
      return {
        title: `${cityName}, ${country} - Image ${i + 1}`,
        sources: {
          mobile: getImageUrl(baseUrl, "mobile"),
          tablet: getImageUrl(baseUrl, "tablet"),
          desktop: getImageUrl(baseUrl, "wide"),
          // Add higher quality versions for full screen
          fullscreen: getImageUrl(baseUrl, "fullscreen"),
        },
      };
    });
  }, [citySlug, countrySlug, cityName, country]);

  // Preload adjacent images
  const preloadAdjacentImages = useCallback(
    (index: number) => {
      const indicesToLoad = [
        index,
        (index + 1) % images.length,
        (index - 1 + images.length) % images.length,
      ];

      indicesToLoad.forEach((idx) => {
        if (!loadedImages.current.has(images[idx].sources.tablet)) {
          const img = new Image();
          img.src = images[idx].sources.tablet;
          img.srcset = `${images[idx].sources.mobile} 640w, 
                      ${images[idx].sources.tablet} 1024w, 
                      ${images[idx].sources.desktop} 1920w`;
          preloadedImages.current.push(img);
          loadedImages.current.add(images[idx].sources.tablet);
        }
      });
    },
    [images]
  );

  useEffect(() => {
    if (priority) {
      // Immediately load first image for hero sections
      const img = new Image();
      img.src = images[0].sources.desktop;
      img.onload = () => setIsLoading(false);
    }
    preloadAdjacentImages(currentIndex);
  }, [priority, images, currentIndex, preloadAdjacentImages]);

  const navigate = useCallback(
    (direction: number) => {
      const newIndex =
        (currentIndex + direction + images.length) % images.length;
      setCurrentIndex(newIndex);
      preloadAdjacentImages(newIndex);
    },
    [currentIndex, images.length, preloadAdjacentImages]
  );

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      {variant === "hero" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </>
      )}

      <picture className="w-full h-full" onClick={onImageClick}>
        <source
          media="(max-width: 640px)"
          srcSet={images[currentIndex].sources.mobile}
        />
        <source
          media="(max-width: 1024px)"
          srcSet={images[currentIndex].sources.tablet}
        />
        <source
          media="(min-width: 1025px)"
          srcSet={
            variant === "hero"
              ? images[currentIndex].sources.desktop
              : images[currentIndex].sources.tablet
          }
        />
        <img
          src={images[currentIndex].sources.tablet}
          alt={images[currentIndex].title}
          className={cn(
            "w-full h-full object-cover",
            onImageClick && "cursor-pointer"
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleImageLoad}
        />
      </picture>

      {/* Add gallery icon for hero variant */}
      {variant === "hero" && onImageClick && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageClick();
            }}
            className="bg-white/90 hover:bg-white rounded-full p-3 
                      transition-all hover:scale-105 shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Open gallery"
          >
            <ImagePlus className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      )}

      {variant === "hero" && isLoading && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </>
      )}

      {images.length > 1 && (
        <div
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-4 transition-opacity duration-200",
            showControls ? "opacity-100" : "opacity-0",
            variant === "hero" && "z-10"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className={cn(
              "bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
              variant === "hero" ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft
              className={cn(
                "text-gray-800",
                variant === "hero"
                  ? "h-5 w-5 sm:h-6 sm:w-6"
                  : "h-4 w-4 sm:h-5 sm:w-5"
              )}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            className={cn(
              "bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
              variant === "hero" ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
            )}
            aria-label="Next image"
          >
            <ChevronRight
              className={cn(
                "text-gray-800",
                variant === "hero"
                  ? "h-5 w-5 sm:h-6 sm:w-6"
                  : "h-4 w-4 sm:h-5 sm:w-5"
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
};
