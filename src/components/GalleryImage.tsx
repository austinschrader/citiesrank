import React from "react";
import { cn } from "@/lib/utils";
import type { GalleryImageType } from "@/types";

interface GalleryImageProps {
  image: GalleryImageType;
  isFullscreen: boolean;
}

export const GalleryImage: React.FC<GalleryImageProps> = React.memo(({ image, isFullscreen }) => (
  <picture>
    <source media="(max-width: 640px)" srcSet={image.sources.mobile} />
    <source media="(max-width: 1024px)" srcSet={image.sources.tablet} />
    <source media="(min-width: 1025px)" srcSet={image.sources.desktop} />
    <img
      src={image.sources.tablet}
      alt={image.title}
      className={cn(
        "object-cover transition-transform duration-500 transform-gpu",
        isFullscreen ? "w-full h-full object-contain" : "w-full h-full group-hover:scale-105"
      )}
      loading="lazy"
      decoding="async"
    />
  </picture>
));

GalleryImage.displayName = "GalleryImage";
