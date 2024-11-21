import React, { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSlug } from "@/lib/imageUtils";
import { getImageUrl } from "@/lib/cloudinary";

interface ImageGalleryProps {
  cityName: string;
  country: string;
  showControls?: boolean; // Add this prop
}

export const ImageGallery = ({ cityName, country, showControls = false }: ImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loadedImages = useRef(new Set<string>());
  const citySlug = createSlug(cityName);
  const countrySlug = createSlug(country);

  const images = useMemo(() => {
    return [1, 2, 3, 4].map((num) => ({
      title: `${cityName}, ${country} (${num}/4)`,
      sources: {
        mobile: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "thumbnail"),
        tablet: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "standard"),
        desktop: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "standard"),
      },
    }));
  }, [cityName, country, citySlug, countrySlug]);

  // Preload the next image only if we haven't loaded it before
  const preloadImage = (index: number) => {
    const imageUrl = images[index].sources.tablet;
    if (!loadedImages.current.has(imageUrl)) {
      const img = new Image();
      img.src = imageUrl;
      loadedImages.current.add(imageUrl);
    }
  };

  // Preload initial images (current and next)
  useEffect(() => {
    loadedImages.current.clear(); // Reset on images change
    loadedImages.current.add(images[0].sources.tablet); // Mark first image as loaded
    if (images.length > 1) {
      preloadImage(1); // Preload second image
    }
  }, [images]);

  const navigate = (direction: number) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);

    // Only set loading if we haven't loaded this image before
    if (!loadedImages.current.has(images[newIndex].sources.tablet)) {
      setIsLoading(true);
    }

    // Preload the next image in sequence
    const nextToPreload = (newIndex + direction + images.length) % images.length;
    preloadImage(nextToPreload);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    loadedImages.current.add(images[currentIndex].sources.tablet);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}

      <picture className="w-full h-full">
        <source media="(max-width: 640px)" srcSet={images[currentIndex].sources.mobile} />
        <source media="(max-width: 1024px)" srcSet={images[currentIndex].sources.tablet} />
        <source media="(min-width: 1025px)" srcSet={images[currentIndex].sources.desktop} />
        <img
          src={images[currentIndex].sources.tablet}
          alt={images[currentIndex].title}
          className="w-full h-full object-cover"
          loading={currentIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleImageLoad}
        />
      </picture>

      {images.length > 1 && (
        <div
          className={cn(
            "absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between transition-opacity duration-200",
            showControls ? "opacity-100" : "opacity-0"
          )}>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-transform hover:scale-105">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-transform hover:scale-105">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
