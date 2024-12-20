import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/features/places/context/FiltersContext";
import { TravelStyle, TravelStyleDefinition } from "@/features/places/types/travel";
import { cn } from "@/lib/utils";
import { Compass, Loader2 } from "lucide-react";
import { useState } from "react";

const travelStyleConfig = {
  cultural: {
    label: "OMG!",
    emoji: "💫",
    description: "Jaw-dropping & magical",
    hoverGradient:
      "from-purple-200/80 via-fuchsia-100 to-pink-200/80 dark:from-purple-800/30 dark:via-fuchsia-900/20 dark:to-pink-800/30",
    activeGradient: "from-purple-500 to-pink-500",
    tags: ["unesco", "history", "culture", "art", "museum"],
    criteria: {
      minRating: 4.0,
      preferredScores: {
        walkScore: 7,
        interesting: 8,
      },
    },
  },
  adventure: {
    label: "Wild Wonder",
    emoji: "🗻",
    description: "Natural beauty & peace",
    hoverGradient:
      "from-emerald-200/80 via-green-100 to-lime-200/80 dark:from-emerald-800/30 dark:via-green-900/20 dark:to-lime-800/30",
    activeGradient: "from-emerald-500 to-green-500",
    tags: ["nature", "hiking", "mountains", "adventure", "scenic"],
    criteria: {
      crowdLevel: { max: 7 },
      accessibility: { max: 8 },
      preferredScores: {
        interesting: 7,
      },
    },
  },
  food: {
    label: "Cuisine",
    emoji: "🍜",
    description: "Markets, food & drinks",
    hoverGradient:
      "from-amber-200/80 via-yellow-100 to-orange-200/80 dark:from-amber-800/30 dark:via-yellow-900/20 dark:to-orange-800/30",
    activeGradient: "from-amber-500 to-yellow-500",
    tags: ["food", "restaurants", "cafes", "markets", "drinks"],
    criteria: {
      preferredScores: {
        interesting: 7,
        walkScore: 7,
      },
    },
  },
  family: {
    label: "Family Friendly",
    emoji: "🎠",
    description: "Safe & family fun",
    hoverGradient:
      "from-sky-200/80 via-cyan-100 to-blue-200/80 dark:from-sky-800/30 dark:via-cyan-900/20 dark:to-blue-800/30",
    activeGradient: "from-sky-500 to-blue-500",
    tags: ["family", "parks", "shopping", "safe", "activities"],
    criteria: {
      accessibility: { min: 8 },
      safetyScore: 8,
      crowdLevel: { min: 4, max: 8 },
      preferredScores: {
        walkScore: 7,
        transitScore: 7,
      },
    },
  },
  digital: {
    label: "Work",
    emoji: "💻",
    description: "Fast WiFi & coworking",
    hoverGradient:
      "from-indigo-200/80 via-blue-100 to-violet-200/80 dark:from-indigo-800/30 dark:via-blue-900/20 dark:to-violet-800/30",
    activeGradient: "from-indigo-500 to-violet-500",
    tags: ["coworking", "cafes", "wifi", "modern", "tech"],
    criteria: {
      costIndex: { max: 7 },
      safetyScore: 7,
      preferredScores: {
        transitScore: 6,
        walkScore: 7,
      },
    },
  },
  nightlife: {
    label: "Night Scene",
    emoji: "🎉",
    description: "Vibrant nights & energy",
    hoverGradient:
      "from-violet-200/80 via-purple-100 to-fuchsia-200/80 dark:from-violet-800/30 dark:via-purple-900/20 dark:to-fuchsia-800/30",
    activeGradient: "from-violet-500 to-fuchsia-500",
    tags: ["nightlife", "bars", "restaurants", "entertainment", "music"],
    criteria: {
      crowdLevel: { min: 6 },
      preferredScores: {
        transitScore: 7,
        walkScore: 8,
      },
    },
  },
} as const;

export const travelStyles: Record<TravelStyle, TravelStyleDefinition> = travelStyleConfig;

export const TravelStyleDropdown = () => {
  const { filters, handleTravelStyleSelect, resetTravelStyleFilter } = useFilters();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (style: TravelStyle | null) => {
    setIsLoading(true);
    await handleTravelStyleSelect(style);
    setIsLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={filters.travelStyle ? "default" : "outline"}
          className={cn(
            "h-9 gap-2 w-[180px] relative",
            filters.travelStyle && "font-medium",
            isLoading && "cursor-not-allowed",
            filters.travelStyle && travelStyleConfig[filters.travelStyle].activeGradient && `bg-gradient-to-r ${travelStyleConfig[filters.travelStyle].activeGradient}`
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Compass className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate max-w-[90px] block">
            {filters.travelStyle
              ? travelStyleConfig[filters.travelStyle].label
              : "Travel Style"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
      >
        <div className="divide-y divide-border/50">
          <div className="px-5 py-4">
            <h4 className="font-semibold text-lg">Choose Your Travel Style</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Find places that match your preferred way of traveling
            </p>
          </div>

          <div className="py-2">
            {(Object.entries(travelStyleConfig) as [TravelStyle, typeof travelStyleConfig[keyof typeof travelStyleConfig]][]).map(
              ([id, style]) => (
                <DropdownMenuItem
                  key={id}
                  className={cn(
                    "px-5 py-2.5 cursor-pointer group relative transition-all duration-200",
                    "hover:bg-gradient-to-r",
                    style.hoverGradient,
                    filters.travelStyle === id && "bg-gradient-to-r",
                    filters.travelStyle === id && style.activeGradient
                  )}
                  onClick={() => handleSelect(id)}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {style.emoji}
                    </span>
                    <div>
                      <div className="font-medium">
                        {style.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {style.description}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            )}
          </div>

          <div className="p-3 bg-muted/50 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(null)}
              className="h-8"
              disabled={!filters.travelStyle || isLoading}
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSelect(null)}
              className="h-8"
              disabled={isLoading}
            >
              Done
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
