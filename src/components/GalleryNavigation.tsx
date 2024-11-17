// components/GalleryNavigation.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryNavigationProps {
  onPrevious: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showControls: boolean;
}

export const GalleryNavigation: React.FC<GalleryNavigationProps> = React.memo(({ onPrevious, onNext, showControls }) => {
  if (!showControls) return null;

  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
        aria-label="Previous image"
        title="Previous image (Left arrow key)">
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full hover:scale-110 active:scale-95 transition shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
        aria-label="Next image"
        title="Next image (Right arrow key)">
        <ChevronRight size={24} />
      </button>
    </>
  );
});

GalleryNavigation.displayName = "GalleryNavigation";
