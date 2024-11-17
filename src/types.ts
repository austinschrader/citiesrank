import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Image-related types
export interface ImageSource {
  blur: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface GalleryImage {
  type: "city" | "attraction";
  title: string;
  sources: ImageSource;
  blur: string;
}

export interface GalleryImage {
  type: "city" | "attraction";
  title: string;
  sources: ImageSource;
  blur: string;
}

// City-related types
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export interface CityData {
  country: string;
  cost: number; // 0-100 (low to high)
  interesting: number; // 0-100 (based on combined factors)
  transit: number; // 0-100 (poor to excellent)
  description: string;
  population: string;
  highlights: string[];
  reviews?: ReviewSummary;
  destinationTypes: string[];
}

export interface RankedCity extends CityData {
  name: string;
  matchScore: number;
  attributeMatches: {
    cost: number;
    interesting: number;
    transit: number;
  };
}

// User preference types
export interface UserPreferences {
  cost: number;
  interesting: number;
  transit: number;
}

// Highlight-related types
export type HighlightCategoryType = "historic" | "architecture" | "nature" | "dining" | "cultural";

export interface HighlightCategory {
  type: HighlightCategoryType;
  icon: ReactNode;
  className: string;
  label: string;
  description: string;
}

export interface HighlightLinkProps {
  highlight: string;
  cityName: string;
  country: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Component Props
export interface CityCardProps {
  city: RankedCity;
}

export interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export interface PreferenceSliderProps {
  icon: LucideIcon;
  label: string;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
  getCurrentLabel: (value: number) => string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

export interface ReviewProps {
  review: ReviewData;
}

export interface ReviewSectionProps {
  reviews: ReviewData[];
}

export interface ImageGalleryProps {
  cityName: string;
  country: string;
  highlights: string[];
  currentHighlight: string | null;
  onHighlightChange?: (highlight: string | null) => void;
  onImagesLoaded?: (images: Set<string>) => void;
}

export interface HighlightLinkSectionProps {
  highlights: string[];
  cityName: string;
  country: string;
  onHighlightClick?: (e: React.MouseEvent) => void;
  availableImages?: Set<string>;
}
