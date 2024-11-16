import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageGalleryProps, GalleryImage } from "@/types";

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
          mobile: `/images/cities/${citySlug}-400.jpg`,
          tablet: `/images/cities/${citySlug}-800.jpg`,
          desktop: `/images/cities/${citySlug}-1600.jpg`,
        },
      },
      ...highlights.map((highlight) => {
        const attractionSlug = createSlug(highlight);
        return {
          type: "attraction" as const,
          title: highlight,
          sources: {
            mobile: `/images/attractions/${citySlug}/${attractionSlug}-400.jpg`,
            tablet: `/images/attractions/${citySlug}/${attractionSlug}-800.jpg`,
            desktop: `/images/attractions/${citySlug}/${attractionSlug}-1600.jpg`,
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const navigate = (direction: number, event?: React.MouseEvent) => {
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
  };

  const handleHighlightClick = (index: number) => {
    setCurrentIndex(index);
    if (onHighlightChange) {
      const selectedImage = loadedImages[index];
      onHighlightChange(selectedImage.type === "attraction" ? selectedImage.title : null);
    }
  };

  if (loadedImages.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 group",
          isFullscreen ? "fixed inset-0 z-50 bg-black/90" : "aspect-[16/10] cursor-pointer"
        )}
        onClick={toggleFullscreen}>
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
              {/* Left Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(-1, e);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <ChevronLeft size={24} />
              </button>

              {/* Right Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(1, e);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="absolute right-4 top-4 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
          <p className="text-white text-base font-medium">{loadedImages[currentIndex].title}</p>
        </div>
      </div>

      {loadedImages.length > 1 && (
        <div className="flex gap-1 mt-1">
          {loadedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleHighlightClick(index)}
              className={cn(
                "relative aspect-[16/10] w-[180px] flex-shrink-0",
                "transition-all duration-200",
                currentIndex === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              )}>
              <img src={image.sources.mobile} alt={image.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent">
                <span className="block px-2 py-1 text-white text-xs truncate">{image.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
