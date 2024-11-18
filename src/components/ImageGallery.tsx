import React, { useState, useMemo } from "react";
import { createSlug } from "@/lib/imageUtils";
import { getImageUrl } from "@/lib/cloudinary";

interface ImageGalleryProps {
  cityName: string;
  country: string;
}

export const ImageGallery = ({ cityName, country }: ImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const citySlug = createSlug(cityName);
  const countrySlug = createSlug(country);

  const images = useMemo(() => {
    return [1, 2, 3, 4].map((num) => ({
      title: `${cityName}, ${country} (${num}/4)`,
      sources: {
        mobile: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "thumbnail"),
        tablet: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "standard"),
        desktop: getImageUrl(`${citySlug}-${countrySlug}-${num}`, "large"),
      },
    }));
  }, [cityName, countrySlug, citySlug, country]);

  const navigate = (direction: number) => {
    setCurrentIndex((current) => (current + direction + images.length) % images.length);
    setIsLoading(true);
  };

  return (
    <div className="relative w-full aspect-[800/600]">
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        {isLoading && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}

        <picture className="w-full h-full">
          <source media="(max-width: 640px)" srcSet={images[currentIndex].sources.mobile} />
          <source media="(max-width: 1024px)" srcSet={images[currentIndex].sources.tablet} />
          <source media="(min-width: 1025px)" srcSet={images[currentIndex].sources.desktop} />
          <img
            src={images[currentIndex].sources.tablet}
            alt={images[currentIndex].title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoading(false)}
          />
        </picture>

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-4">
            <button onClick={() => navigate(-1)} className="bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70">
              Previous
            </button>
            <button onClick={() => navigate(1)} className="bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
