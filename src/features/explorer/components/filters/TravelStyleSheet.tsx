import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";
import { useState } from "react";

const TRAVEL_STYLES = [
  {
    id: "adventure",
    label: "Adventure & Outdoors",
    description: "For thrill-seekers and nature lovers",
    sortKey: "outdoorScore",
  },
  {
    id: "culture",
    label: "Culture & History",
    description: "Rich in heritage and traditions",
    sortKey: "cultureScore",
  },
  {
    id: "nightlife",
    label: "Nightlife & Entertainment",
    description: "Vibrant after-dark scenes",
    sortKey: "nightlifeScore",
  },
  {
    id: "relaxation",
    label: "Relaxation & Wellness",
    description: "Perfect for unwinding",
    sortKey: "relaxationScore",
  },
  {
    id: "food",
    label: "Food & Dining",
    description: "Culinary destinations",
    sortKey: "foodScore",
  },
] as const;

export const TravelStyleSheet = () => {
  const { filters, setFilters } = useFilters();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    // For now, we'll just apply a simple sort order
    // In the future, this would be replaced with actual filtering/scoring logic
    setFilters({
      sort: "popular", // This would be replaced with actual sorting based on the style
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 h-9",
            selectedStyle && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Compass className="h-4 w-4" />
          {selectedStyle
            ? TRAVEL_STYLES.find((style) => style.id === selectedStyle)?.label
            : "Travel Style"}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Choose Your Travel Style</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {TRAVEL_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleSelect(style.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-lg border transition-all",
                selectedStyle === style.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <span className="font-medium">{style.label}</span>
              <span className="text-sm opacity-80">{style.description}</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
