// types.ts
export interface CityData {
  country: string;
  cost: number; // 0-100 (low to high)
  interesting: number; // 0-100 (based on combined factors)
  transit: number; // 0-100 (poor to excellent)
  description: string;
  population: string;
  highlights: string[];
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

export interface UserPreferences {
  cost: number;
  interesting: number;
  transit: number;
}

export interface HighlightLinkProps {
  highlight: string;
  cityName: string;
  country: string;
  onClick?: (e: React.MouseEvent) => void;
}

import type { ReactNode } from "react";

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

// types.ts

// City-related types
export interface CityData {
  country: string;
  cost: number; // 0-100 (low to high)
  interesting: number; // 0-100 (based on combined factors)
  transit: number; // 0-100 (poor to excellent)
  description: string;
  population: string;
  highlights: string[];
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

export interface HighlightLinkSectionProps {
  highlights: string[];
  cityName: string;
  country: string;
  onHighlightClick?: (e: React.MouseEvent) => void;
}
