import type { ReactNode } from "react";

// Image-related types
export interface ImageSource {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface GalleryImageType {
  type: "city" | "attraction";
  title: string;
  sources: ImageSource;
}

// Review types
export interface ReviewData {
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
  isVerified?: boolean;
}

// Gallery and Highlight types
export interface ImageGalleryProps {
  cityName: string;
  country: string;
  highlights: string[];
  currentHighlight: string | null;
  onHighlightChange?: (highlight: string | null) => void;
  onImagesLoaded?: (images: Set<string>) => void;
}

export interface HighlightCategory {
  type: string;
  icon: ReactNode;
  className: string;
  label: string;
  description: string;
}
