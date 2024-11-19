import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
}

export const DestinationFilter = ({ selectedFilter, onFilterSelect }: DestinationFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const filterOptions = [
    // { id: "coastal", label: "Coastal Cities" },
    // { id: "mountain", label: "Mountain Towns" },
    // { id: "metropolis", label: "Major Metros" },
    // { id: "historic", label: "Historic Cities" },
    // { id: "culinary", label: "Food Capitals" },
    // { id: "cultural", label: "Cultural Hubs" },
    // { id: "wineries", label: "Wine Regions" },
    // { id: "adventure", label: "Adventure Sports" },
    // { id: "ports", label: "Port Cities" },
    // { id: "winter", label: "Winter Sports" },
    // { id: "tropical", label: "Tropical Paradise" },
    // { id: "ancient", label: "Ancient Cities" },
    // { id: "digital-nomad", label: "Digital Nomad" },
    // { id: "arts", label: "Arts & Music" },
    // { id: "village", label: "Small Villages" },
    // { id: "forest", label: "Forest Towns" },
    // { id: "emerging", label: "Up & Coming" },
    // { id: "wellness", label: "Wellness" },
    // { id: "surf", label: "Surf Towns" },
    // { id: "gastronomy", label: "Fine Dining" },
    { id: "metropolis", label: "Major Cities" }, // Covers urban experiences
    { id: "coastal", label: "Coastal Cities" }, // Beach/ocean destinations
    { id: "mountain", label: "Mountain Towns" }, // Mountain/hiking destinations
    { id: "historic", label: "Historic Sites" }, // Cultural/historical places
    { id: "cultural", label: "Cultural Hubs" }, // Arts, music, museums
    { id: "culinary", label: "Food & Wine" }, // Combines culinary/wineries
    { id: "tropical", label: "Tropical" }, // Island/warm destinations
    { id: "adventure", label: "Adventure" }, // Sports/outdoor activities
    { id: "wellness", label: "Wellness" }, // Spas/retreats/relaxation
    { id: "village", label: "Small Towns" },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    const currentScroll = scrollRef.current.scrollLeft;

    scrollRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
      window.addEventListener("resize", checkScrollPosition);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Left fade and arrow */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 flex items-center",
          "transition-opacity duration-200",
          showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
        <Button
          variant="outline"
          size="icon"
          className="relative h-8 w-8 rounded-full border shadow-md bg-background/95 ml-2 hover:bg-background"
          onClick={() => handleScroll("left")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Right fade and arrow */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center",
          "transition-opacity duration-200",
          showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        <Button
          variant="outline"
          size="icon"
          className="relative h-8 w-8 rounded-full border shadow-md bg-background/95 mr-2 hover:bg-background"
          onClick={() => handleScroll("right")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div ref={scrollRef} className="overflow-x-auto px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2 min-w-max py-2">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => onFilterSelect(option.id)}
              className={cn(
                "px-4 py-2 transition-all duration-200 font-medium",
                "hover:scale-105",
                "shadow-sm",
                selectedFilter === option.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105"
                  : "bg-background hover:bg-accent text-muted-foreground hover:text-accent-foreground"
              )}>
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
