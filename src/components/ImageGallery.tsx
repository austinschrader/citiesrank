import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const ImageGallery: React.FC<ImageGalleryProps> = ({ cityName, country, highlights, currentHighlight, onHighlightChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Check which images actually exist
  useEffect(() => {
    const checkImages = async () => {
      setIsLoading(true);
      const validImages = [];

      for (const image of potentialImages) {
        try {
          const response = await fetch(image.sources.tablet, { method: "HEAD" });
          if (response.ok) {
            validImages.push(image);
          }
        } catch {
          // Skip failed images
          continue;
        }
      }

      setLoadedImages(validImages);
      setIsLoading(false);
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

  if (isLoading) {
    return <div className="aspect-[16/10] rounded-xl bg-neutral-100 animate-pulse" />;
  }

  if (loadedImages.length === 0) {
    return (
      <div className="aspect-[16/10] rounded-xl bg-neutral-100 flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300",
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

        {loadedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={(e) => navigate(-1, e)}>
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
              onClick={(e) => navigate(1, e)}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}>
          {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
        </Button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-sm font-medium">{loadedImages[currentIndex].title}</p>
        </div>
      </div>

      {loadedImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {loadedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleHighlightClick(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden",
                currentIndex === index && "ring-2 ring-primary ring-offset-2"
              )}>
              <img src={image.sources.mobile} alt={image.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
