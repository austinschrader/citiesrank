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
