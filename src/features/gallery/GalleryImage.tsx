// file location: src/features/gallery/GalleryImage.tsx
import React, { useState } from "react";

interface GalleryImageType {
  sources: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  title: string;
}

interface GalleryImageProps {
  image: GalleryImageType;
  isFullscreen: boolean;
}

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const GalleryImage: React.FC<GalleryImageProps> = React.memo(({ image, isFullscreen }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[300px]">
      {/* Placeholder */}
      {isLoading && (
        <div className={cn("absolute inset-0 bg-slate-200 animate-pulse", isFullscreen ? "bg-opacity-50" : "bg-opacity-100")} />
      )}

      {/* Image */}
      <picture className="w-full h-full">
        <source media="(max-width: 640px)" srcSet={image.sources.mobile} />
        <source media="(max-width: 1024px)" srcSet={image.sources.tablet} />
        <source media="(min-width: 1025px)" srcSet={image.sources.desktop} />
        <img
          src={image.sources.tablet}
          alt={image.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isFullscreen ? "object-contain" : "group-hover:scale-105",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoading(false)}
        />
      </picture>
    </div>
  );
});

GalleryImage.displayName = "GalleryImage";

export default GalleryImage;
