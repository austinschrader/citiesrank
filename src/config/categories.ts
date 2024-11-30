import React from "react";
import { Landmark, Building, Trees, Utensils, Palette } from "lucide-react";
import { HighlightCategory } from "@/lib/types/types";

export const CATEGORIES: Record<string, HighlightCategory> = {
  historic: {
    type: "historic",
    icon: React.createElement(Landmark, { className: "w-4 h-4" }),
    className:
      "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200",
    label: "Historical Sites",
    description: "Monuments, castles, historic bridges",
  },
  architecture: {
    type: "architecture",
    icon: React.createElement(Building, { className: "w-4 h-4" }),
    className:
      "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200",
    label: "Architecture",
    description: "Notable buildings, districts, squares",
  },
  nature: {
    type: "nature",
    icon: React.createElement(Trees, { className: "w-4 h-4" }),
    className:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
    label: "Nature",
    description: "Parks, gardens, outdoor spaces",
  },
  dining: {
    type: "dining",
    icon: React.createElement(Utensils, { className: "w-4 h-4" }),
    className:
      "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200",
    label: "Food & Drink",
    description: "Markets, restaurants, local cuisine",
  },
  cultural: {
    type: "cultural",
    icon: React.createElement(Palette, { className: "w-4 h-4" }),
    className:
      "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200",
    label: "Arts & Culture",
    description: "Museums, theaters, galleries",
  },
} as const;
