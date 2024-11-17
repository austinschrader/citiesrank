import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageGalleryProps, GalleryImage } from "@/types";
import { getImageUrl } from "@/lib/cloudinary";

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
export const ImageGallery: React.FC<ImageGalleryProps> = ({ cityName, country, highlights, currentHighlight, onHighlightChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);

  const citySlug = createSlug(cityName);

  const potentialImages: GalleryImage[] = useMemo(
    () => [
      {
        type: "city" as const,
        title: `${cityName}, ${country}`,
        sources: {
          mobile: getImageUrl(citySlug, "thumbnail"),
          tablet: getImageUrl(citySlug, "standard"),
          desktop: getImageUrl(citySlug, "large"),
        },
      },
      ...highlights.map((highlight) => {
        const attractionSlug = createSlug(highlight);
        return {
          type: "attraction" as const,
          title: highlight,
          sources: {
            mobile: getImageUrl(`${citySlug}/${attractionSlug}`, "thumbnail"),
            tablet: getImageUrl(`${citySlug}/${attractionSlug}`, "standard"),
            desktop: getImageUrl(`${citySlug}/${attractionSlug}`, "large"),
          },
        };
      }),
    ],
    [cityName, country, highlights, citySlug]
  );

  useEffect(() => {
    const checkImages = async () => {
      const validImages = [];

      for (const image of potentialImages) {
        try {
          const exists = await checkImageExists(image.sources.tablet);
          if (exists) {
            validImages.push(image);
          }
        } catch {
          continue;
        }
      }

      setLoadedImages(validImages);
    };

    checkImages();
  }, [potentialImages]);

  useEffect(() => {
    if (currentHighlight && loadedImages.length > 0) {
      const index = loadedImages.findIndex((img) => img.title === currentHighlight);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [currentHighlight, loadedImages]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const navigate = useCallback(
    (direction: number, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }

      setCurrentIndex((current) => {
        const newIndex = current + direction;
        if (newIndex >= loadedImages.length) return 0;
        if (newIndex < 0) return loadedImages.length - 1;
        return newIndex;
      });

      if (onHighlightChange) {
        const newImage = loadedImages[(currentIndex + direction + loadedImages.length) % loadedImages.length];
        onHighlightChange(newImage.type === "attraction" ? newImage.title : null);
      }
    },
    [currentIndex, loadedImages, onHighlightChange]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case "Escape":
            toggleFullscreen();
            break;
          case "ArrowLeft":
            navigate(-1);
            break;
          case "ArrowRight":
            navigate(1);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, navigate, toggleFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (loadedImages.length === 0) {
    return null;
  }

  return (
    <div className="relative" role="region" aria-label="Image gallery">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 group",
          isFullscreen ? "fixed inset-0 z-50 bg-black/90" : "aspect-[16/10] cursor-zoom-in"
        )}
        onClick={toggleFullscreen}
        role={isFullscreen ? "dialog" : undefined}
        aria-modal={isFullscreen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isFullscreen) {
            toggleFullscreen();
          }
        }}>
        <picture>
          <source media="(max-width: 640px)" srcSet={loadedImages[currentIndex].sources.mobile} />
          <source media="(max-width: 1024px)" srcSet={loadedImages[currentIndex].sources.tablet} />
          <source media="(min-width: 1025px)" srcSet={loadedImages[currentIndex].sources.desktop} />
          <img
            src={loadedImages[currentIndex].sources.tablet}
            alt={loadedImages[currentIndex].title}
            className={cn(
              "object-cover transition-transform duration-500 transform-gpu",
              isFullscreen ? "w-full h-full object-contain" : "w-full h-full group-hover:scale-105"
            )}
            loading="lazy"
            decoding="async"
          />
        </picture>

        {/* Navigation Controls */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isFullscreen && "opacity-100"
          )}>
          {loadedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1, e);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                aria-label="Previous image"
                title="Previous image (Left arrow key)">
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1, e);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                aria-label="Next image"
                title="Next image (Right arrow key)">
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="absolute right-4 top-4 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
              aria-label="Close gallery"
              title="Close gallery (Esc key)">
              <Minimize2 size={24} />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
            <p className="text-white text-base font-medium">{loadedImages[currentIndex].title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
