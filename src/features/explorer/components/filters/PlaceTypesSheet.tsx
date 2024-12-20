import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { Building2, Globe2, Landmark, MapPin } from "lucide-react";

const placeTypeIcons = {
  [CitiesTypeOptions.country]: {
    icon: Globe2,
    label: "Countries",
    emoji: "🌎",
  },
  [CitiesTypeOptions.region]: { icon: Landmark, label: "Regions", emoji: "🗺️" },
  [CitiesTypeOptions.city]: { icon: Building2, label: "Cities", emoji: "🌆" },
  [CitiesTypeOptions.neighborhood]: {
    icon: Landmark,
    label: "Neighborhoods",
    emoji: "🏘️",
  },
  [CitiesTypeOptions.sight]: { icon: MapPin, label: "Sights", emoji: "🗽" },
};

export const PlaceTypesSheet = () => {
  const { cities } = useCities();
  const { filters, setFilters, resetTypeFilters } = useFilters();

  const handleTypeClick = (type: CitiesTypeOptions) => {
    const newTypes = filters.activeTypes.includes(type)
      ? filters.activeTypes.filter((t) => t !== type)
      : [...filters.activeTypes, type];
    setFilters({ ...filters, activeTypes: newTypes });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={filters.activeTypes.length > 0 ? "default" : "outline"}
          className={cn(
            "h-9 gap-2 w-[180px]",
            filters.activeTypes.length > 0 && "font-medium"
          )}
        >
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[90px] block">
            {filters.activeTypes.length > 0
              ? filters.activeTypes
                  .map((type) => placeTypeIcons[type].label)
                  .join(", ")
              : "Place Type"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
      >
        <div className="divide-y divide-border/50">
          <div className="px-5 py-4">
            <h4 className="font-semibold text-lg">Discover Places By Type</h4>
            <p className="text-sm text-muted-foreground mt-1">
              From countries and regions to local neighborhoods
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {Object.values(CitiesTypeOptions).map((type) => (
              <div key={type}>
                <div
                  onClick={() => handleTypeClick(type)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTypeClick(type);
                    }
                  }}
                  style={
                    {
                      "--marker-color":
                        markerColors[type as keyof typeof markerColors],
                      backgroundColor: filters.activeTypes.includes(type)
                        ? `${markerColors[type as keyof typeof markerColors]}15`
                        : undefined,
                    } as React.CSSProperties
                  }
                  className={cn(
                    "w-full px-5 py-3 flex items-center justify-between",
                    "transition-all duration-200 ease-in-out",
                    filters.activeTypes.includes(type)
                      ? "hover:brightness-110"
                      : "hover:bg-accent/10",
                    "cursor-pointer"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        filters.activeTypes.includes(type)
                          ? "opacity-100 scale-125"
                          : "opacity-40"
                      )}
                      style={{
                        backgroundColor: "var(--marker-color)",
                        boxShadow: filters.activeTypes.includes(type)
                          ? "0 0 8px var(--marker-color)"
                          : "none",
                      }}
                    />
                    <span
                      className="text-lg"
                      role="img"
                      aria-label={`${type} emoji`}
                    >
                      {placeTypeIcons[type].emoji}
                    </span>
                    <span
                      className="text-sm font-medium capitalize transition-all duration-200"
                      style={{
                        color: filters.activeTypes.includes(type)
                          ? "var(--marker-color)"
                          : "var(--muted-foreground)",
                      }}
                    >
                      {type}s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-muted/50 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetTypeFilters()}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
            <DropdownMenuItem onSelect={() => {}}>
              <Button size="sm">Done</Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
