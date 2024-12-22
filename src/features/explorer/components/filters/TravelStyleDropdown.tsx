import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/features/places/context/FiltersContext";
import { cn } from "@/lib/utils";
import { Compass, Loader2 } from "lucide-react";
import { useState } from "react";

type TravelStyleKey = "cultural" | "adventure" | "food" | "urban" | "beach" | "family";

const travelStyleConfig: Record<TravelStyleKey, {
  label: string;
  emoji: string;
  description: string;
  hoverGradient: string;
  activeGradient: string;
  tag: string;
}> = {
  cultural: {
    label: "OMG!",
    emoji: "💫",
    description: "Jaw-dropping & magical",
    hoverGradient:
      "from-purple-200/80 via-fuchsia-100 to-pink-200/80 dark:from-purple-800/30 dark:via-fuchsia-900/20 dark:to-pink-800/30",
    activeGradient: "from-purple-500 to-pink-500",
    tag: "culture",
  },
  adventure: {
    label: "Wild Wonder",
    emoji: "🗻",
    description: "Natural beauty & peace",
    hoverGradient:
      "from-emerald-200/80 via-green-100 to-lime-200/80 dark:from-emerald-800/30 dark:via-green-900/20 dark:to-lime-800/30",
    activeGradient: "from-emerald-500 to-green-500",
    tag: "adventure",
  },
  food: {
    label: "Cuisine",
    emoji: "🍜",
    description: "Markets, food & drinks",
    hoverGradient:
      "from-amber-200/80 via-yellow-100 to-orange-200/80 dark:from-amber-800/30 dark:via-yellow-900/20 dark:to-orange-800/30",
    activeGradient: "from-amber-500 to-orange-500",
    tag: "food",
  },
  urban: {
    label: "City Life",
    emoji: "🌆",
    description: "Urban exploration & nightlife",
    hoverGradient:
      "from-blue-200/80 via-sky-100 to-indigo-200/80 dark:from-blue-800/30 dark:via-sky-900/20 dark:to-indigo-800/30",
    activeGradient: "from-blue-500 to-indigo-500",
    tag: "urban",
  },
  beach: {
    label: "Beach Life",
    emoji: "🏖️",
    description: "Sun, sand & relaxation",
    hoverGradient:
      "from-cyan-200/80 via-sky-100 to-blue-200/80 dark:from-cyan-800/30 dark:via-sky-900/20 dark:to-blue-800/30",
    activeGradient: "from-cyan-500 to-blue-500",
    tag: "beach",
  },
  family: {
    label: "Family Fun",
    emoji: "👨‍👩‍👧‍👦",
    description: "Kid-friendly & entertaining",
    hoverGradient:
      "from-rose-200/80 via-pink-100 to-red-200/80 dark:from-rose-800/30 dark:via-pink-900/20 dark:to-red-800/30",
    activeGradient: "from-rose-500 to-red-500",
    tag: "family-friendly",
  },
};

export const TravelStyleDropdown = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { filters, handleTravelStyleSelect } = useFilters();

  const handleSelect = async (style: TravelStyleKey | null) => {
    setIsLoading(true);
    await handleTravelStyleSelect(style ? travelStyleConfig[style].tag : null);
    setIsLoading(false);
  };

  // Find the current style based on the tag
  const currentStyle = Object.entries(travelStyleConfig).find(
    ([_, config]) => config.tag === filters.travelStyle
  )?.[0] as TravelStyleKey | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className={cn(
            "gap-2 transition-all",
            currentStyle &&
              travelStyleConfig[currentStyle].activeGradient &&
              `bg-gradient-to-r ${travelStyleConfig[currentStyle].activeGradient}`
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Compass className="h-4 w-4" />
          )}
          {currentStyle
            ? travelStyleConfig[currentStyle].label
            : "Travel Style"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {(Object.entries(travelStyleConfig) as [TravelStyleKey, typeof travelStyleConfig[TravelStyleKey]][]).map(
          ([key, style]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleSelect(filters.travelStyle === style.tag ? null : key)}
              className={cn(
                "gap-2 cursor-pointer transition-all hover:bg-gradient-to-r",
                style.hoverGradient,
                filters.travelStyle === style.tag &&
                  `bg-gradient-to-r ${style.activeGradient}`
              )}
            >
              <span>{style.emoji}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{style.label}</span>
                <span className="text-xs text-muted-foreground">
                  {style.description}
                </span>
              </div>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
