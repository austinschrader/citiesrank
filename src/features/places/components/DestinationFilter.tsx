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
import { PLACE_TAGS, TAG_GROUPS } from "../types/tags";

const destinationTypes = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Compass },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  { type: CitiesTypeOptions.neighborhood, label: "Neighborhoods", icon: Home },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
];

export const DestinationFilter = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
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
      {/* Place Types */}
      <div className="flex items-center gap-2 px-8 pt-3">
        {destinationTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() =>
              setFilter(
                "activeTypes",
                filters.activeTypes.includes(type)
                  ? filters.activeTypes.filter((t) => t !== type)
                  : [...filters.activeTypes, type]
              )
            }
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              filters.activeTypes.includes(type)
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-8 pb-3 scrollbar-none scroll-smooth"
        >
          {PLACE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setFilter(
                  "tags",
                  filters.tags.includes(tag)
                    ? filters.tags.filter((t) => t !== tag)
                    : [...filters.tags, tag]
                )
              }
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                filters.tags.includes(tag)
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {tag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
