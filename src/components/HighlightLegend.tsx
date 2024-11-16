import React from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../config/categories";

export const HighlightsLegend = () => (
  <div className="max-w-4xl mx-auto mb-8">
    <h2 className="text-lg font-semibold mb-3">Discover City Highlights</h2>
    <div className="flex flex-wrap gap-3">
      {Object.values(CATEGORIES).map((category) => (
        <div key={category.type} className="relative group">
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-help", category.className)}>
            {category.icon}
            <span>{category.label}</span>
          </div>
          <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-white rounded-lg shadow-lg border text-xs z-10">
            {category.description}
          </div>
        </div>
      ))}
    </div>
  </div>
);
