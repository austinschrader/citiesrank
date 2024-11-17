import { useState, useEffect, useCallback } from "react";
import type { GalleryImageType } from "@/types";
import { checkImageExists } from "@/lib/imageUtils";

interface UseImageGalleryProps {
  images: GalleryImageType[];
  onHighlightChange?: (highlight: string | null) => void;
  initialHighlight?: string | null;
}

export const useImageGallery = ({ images, onHighlightChange, initialHighlight }: UseImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<GalleryImageType[]>([]);

  useEffect(() => {
    const checkImages = async () => {
      const validImages = [];
      for (const image of images) {
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
  }, [images]);

  useEffect(() => {
    if (initialHighlight && loadedImages.length > 0) {
      const index = loadedImages.findIndex((img) => img.title === initialHighlight);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialHighlight, loadedImages]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex((current) => {
        const newIndex = (current + direction + loadedImages.length) % loadedImages.length;
        const newImage = loadedImages[newIndex];
        if (onHighlightChange) {
          onHighlightChange(newImage.type === "attraction" ? newImage.title : null);
        }
        return newIndex;
      });
    },
    [loadedImages, onHighlightChange]
  );

  return {
    currentIndex,
    isFullscreen,
    loadedImages,
    toggleFullscreen,
    navigate,
    setCurrentIndex,
  };
};
