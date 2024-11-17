import React, { useMemo } from "react";
import { Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageGalleryProps, GalleryImageType } from "@/types";
import { getImageUrl } from "@/lib/cloudinary";
import { createSlug } from "@/lib/imageUtils";
import { useImageGallery } from "@/hooks/useImageGallery";
import { useGalleryKeyboard } from "@/hooks/useGalleryKeyboard";
import { useScrollLock } from "@/hooks/useScrollLock";
import { GalleryImage } from "@/components/GalleryImage";
import { GalleryNavigation } from "@/components/GalleryNavigation";
import { galleryControls, galleryStyles } from "@/lib/styles/gallery";

export const ImageGallery: React.FC<ImageGalleryProps> = ({ cityName, country, highlights, currentHighlight, onHighlightChange }) => {
  const citySlug = createSlug(cityName);

  const potentialImages: GalleryImageType[] = useMemo(
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
      ...highlights.map((highlight) => ({
        type: "attraction" as const,
        title: highlight,
        sources: {
          mobile: getImageUrl(createSlug(highlight), "thumbnail"),
          tablet: getImageUrl(createSlug(highlight), "standard"),
          desktop: getImageUrl(createSlug(highlight), "large"),
        },
      })),
    ],
    [cityName, country, highlights, citySlug]
  );

  const { currentIndex, isFullscreen, loadedImages, toggleFullscreen, navigate } = useImageGallery({
    images: potentialImages,
    onHighlightChange,
    initialHighlight: currentHighlight,
  });

  useGalleryKeyboard(isFullscreen, toggleFullscreen, navigate);
  useScrollLock(isFullscreen);

  if (loadedImages.length === 0) {
    return null;
  }

  const handleNavigationClick = (direction: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(direction);
  };

  return (
    <div className={galleryStyles.container} role="region" aria-label="Image gallery">
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
        <GalleryImage image={loadedImages[currentIndex]} isFullscreen={isFullscreen} />

        <div className={galleryControls({ visible: isFullscreen })}>
          <GalleryNavigation
            onPrevious={(e) => handleNavigationClick(-1, e)}
            onNext={(e) => handleNavigationClick(1, e)}
            showControls={loadedImages.length > 1}
          />

          {isFullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className={galleryStyles.closeButton}
              aria-label="Close gallery"
              title="Close gallery (Esc key)">
              <Minimize2 size={24} />
            </button>
          )}

          <div className={galleryStyles.caption}>
            <p className={galleryStyles.captionText}>{loadedImages[currentIndex].title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
