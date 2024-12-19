/**
 * RatingFilter: Filter component for filtering places by average rating
 * src/features/places/components/filters/RatingFilter.tsx
 */

import { Slider } from "@/components/ui/slider";
import { useFilters } from "@/features/places/context/FiltersContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SimpleFilterSectionProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const SimpleFilterSection = ({ title, defaultExpanded = true, children }: SimpleFilterSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b last:border-b-0">
      <button
        className="flex items-center justify-between w-full p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded && <div className="pb-4">{children}</div>}
    </div>
  );
};

export const RatingFilter = () => {
  const { filters, setFilter } = useFilters();

  const handleRatingChange = (value: number[]) => {
    setFilter("averageRating", value[0] || null);
  };

  return (
    <SimpleFilterSection title="Minimum Rating">
      <div className="px-4">
        <Slider
          defaultValue={[0]}
          value={filters.averageRating ? [filters.averageRating] : [0]}
          onValueChange={handleRatingChange}
          max={5}
          min={0}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Any</span>
          <span>{filters.averageRating || "Any"}</span>
        </div>
      </div>
    </SimpleFilterSection>
  );
};
