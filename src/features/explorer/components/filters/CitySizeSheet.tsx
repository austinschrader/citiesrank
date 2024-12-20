import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { Building2 } from "lucide-react";

const sizeTypeIcons = {
  village: { icon: Building2, label: "Villages", emoji: "🏘️" },
  town: { icon: Building2, label: "Towns", emoji: "🏰" },
  city: { icon: Building2, label: "Cities", emoji: "🌆" },
  megacity: { icon: Building2, label: "Megacities", emoji: "🌇" },
} as const;

export const CitySizeSheet = () => {
  const { filters, handlePopulationSelect } = useFilters();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={filters.populationCategory ? "default" : "outline"}
          className={cn(
            "h-9 gap-2 w-[180px]",
            filters.populationCategory && "font-medium"
          )}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate max-w-[90px] block">
            {filters.populationCategory
              ? sizeTypeIcons[filters.populationCategory].label
              : "City Size"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[320px] p-0 bg-background/95 backdrop-blur-sm"
      >
        <div className="divide-y divide-border/50">
          <div className="px-5 py-4">
            <h4 className="font-semibold text-lg">Filter by City Size</h4>
            <p className="text-sm text-muted-foreground mt-1">
              From small villages to bustling megacities
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {(["megacity", "city", "town", "village"] as const).map((size) => (
              <div
                key={size}
                onClick={() =>
                  handlePopulationSelect(
                    filters.populationCategory === size ? null : size
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePopulationSelect(
                      filters.populationCategory === size ? null : size
                    );
                  }
                }}
                style={
                  {
                    "--marker-color": markerColors[CitiesTypeOptions.city],
                    backgroundColor:
                      filters.populationCategory === size
                        ? `${markerColors[CitiesTypeOptions.city]}15`
                        : undefined,
                  } as React.CSSProperties
                }
                className={cn(
                  "w-full px-5 py-3 flex items-center justify-between",
                  "transition-all duration-200 ease-in-out",
                  filters.populationCategory === size
                    ? "hover:brightness-110"
                    : "hover:bg-accent/10",
                  "cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      filters.populationCategory === size
                        ? "opacity-100 scale-125"
                        : "opacity-40"
                    )}
                    style={{
                      backgroundColor: "var(--marker-color)",
                      boxShadow:
                        filters.populationCategory === size
                          ? "0 0 8px var(--marker-color)"
                          : "none",
                    }}
                  />
                  <span
                    className="text-lg"
                    role="img"
                    aria-label={`${size} emoji`}
                  >
                    {sizeTypeIcons[size].emoji}
                  </span>
                  <span
                    className="text-sm font-medium capitalize transition-all duration-200"
                    style={{
                      color:
                        filters.populationCategory === size
                          ? "var(--marker-color)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {size}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-muted/50 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePopulationSelect(null)}
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
