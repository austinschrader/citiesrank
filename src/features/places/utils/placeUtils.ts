// src/features/places/utils/placeUtils.ts
/**
 * Shared utilities for place-related operations
 */
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Building2, Compass, Globe2, Home, Landmark } from "lucide-react";

export const createSlug = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
};

export const getPlaceTypeInfo = (types: CitiesTypeOptions[] | undefined) => {
  const type = types?.[0] || CitiesTypeOptions.city;
  return {
    [CitiesTypeOptions.country]: {
      icon: Globe2,
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    [CitiesTypeOptions.region]: {
      icon: Compass,
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    [CitiesTypeOptions.city]: {
      icon: Building2,
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    },
    [CitiesTypeOptions.neighborhood]: {
      icon: Home,
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    },
    [CitiesTypeOptions.sight]: {
      icon: Landmark,
      color: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    },
  }[type];
};

export const getMatchColor = (score: number): string => {
  if (score >= 90) return "bg-green-50 text-green-700";
  if (score >= 75) return "bg-blue-50 text-blue-700";
  if (score >= 60) return "bg-yellow-50 text-yellow-700";
  return "bg-gray-50 text-gray-700";
};
