import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useTags } from "../hooks/useTags";

interface DestinationFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
}

export const DestinationFilter = ({
  selectedFilter,
  onFilterSelect,
}: DestinationFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { filterOptions, isLoading, error } = useTags();

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
    <div className="relative w-full border-b bg-background flex items-center">
      {/* Left arrow */}
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

      {/* Gradient fades */}
      <div className="absolute left-12 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-12 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex gap-6 min-w-max py-3 px-8">
          <div className="flex gap-4 min-w-max py-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onFilterSelect(option.id)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full whitespace-nowrap text-sm font-medium transition-colors",
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

      {/* Right arrow */}
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
  );
};
