// file location: src/features/places/components/DestinationFilter.tsx
import { Button } from "@/components/ui/button";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { useFilters } from "@/features/places/context/FiltersContext";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Home,
  Landmark,
} from "lucide-react";
import { useRef } from "react";
import { useTags } from "../hooks/useTags";

const destinationTypes = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Compass },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  { type: CitiesTypeOptions.neighborhood, label: "Neighborhoods", icon: Home },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
];

export const DestinationFilter = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { filterOptions } = useTags();
  const { filters, setFilter } = useFilters();

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    const currentScroll = scrollRef.current.scrollLeft;

    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full border-b bg-background flex flex-col gap-3">
      {/* Place Types (Implemented) */}
      <div className="flex items-center gap-2 px-8 pt-3">
        {destinationTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setFilter('placeType', filters.placeType === type ? null : type)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50",
              filters.placeType === type
                ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Filter Tags (Display Only) */}
      <div className="relative flex items-center">
        <div className="flex-none pl-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 hover:bg-accent hover:text-accent-foreground"
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute left-12 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-12 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-6 min-w-max py-3 px-8">
            <div className="flex gap-4 min-w-max py-2">
              {filterOptions.map((option) => {
                const isSelected = filters.tags.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      const newTags = isSelected
                        ? filters.tags.filter(id => id !== option.id)
                        : [...filters.tags, option.id];
                      setFilter('tags', newTags);
                    }}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full whitespace-nowrap text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      "disabled:pointer-events-none disabled:opacity-50",
                      "h-9 px-4 py-2",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-none pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 hover:bg-accent hover:text-accent-foreground"
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
