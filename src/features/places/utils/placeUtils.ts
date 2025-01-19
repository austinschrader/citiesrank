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
      label: "Country",
      color: "text-blue-500",
    },
    [CitiesTypeOptions.region]: {
      icon: Compass,
      label: "Region",
      color: "text-green-500",
    },
    [CitiesTypeOptions.city]: {
      icon: Building2,
      label: "City",
      color: "text-purple-500",
    },
    [CitiesTypeOptions.neighborhood]: {
      icon: Home,
      label: "Neighborhood",
      color: "text-orange-500",
    },
    [CitiesTypeOptions.sight]: {
      icon: Landmark,
      label: "Sight",
      color: "text-red-500",
    },
  }[type];
};
