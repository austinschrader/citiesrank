import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DestinationFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
}

export const DestinationFilter = ({
  selectedFilter,
  onFilterSelect,
}: DestinationFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const filterOptions = [
    { id: "metropolis", label: "Major Cities" },
    { id: "coastal", label: "Coastal Cities" },
    { id: "mountain", label: "Mountain Towns" },
    { id: "historic", label: "Historic Sites" },
    { id: "cultural", label: "Cultural Hubs" },
    { id: "culinary", label: "Food & Wine" },
    { id: "tropical", label: "Tropical" },
    { id: "adventure", label: "Adventure" },
    { id: "wellness", label: "Wellness" },
    { id: "village", label: "Small Towns" },
  ];

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
    <div className="relative w-full border-b bg-background">
      {/* Left fade and arrow */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 flex items-center z-10",
          "transition-opacity duration-200",
          showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 ml-2"
          onClick={() => handleScroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Right fade and arrow */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center z-10",
          "transition-opacity duration-200",
          showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 mr-2"
          onClick={() => handleScroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex gap-6 min-w-max py-3">
          <div className="flex gap-4 min-w-max py-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onFilterSelect(option.id)}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "h-9 px-4 py-2",
                  selectedFilter === option.id
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
