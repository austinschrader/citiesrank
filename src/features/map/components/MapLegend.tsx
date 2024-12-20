import { Button } from "@/components/ui/button";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useState } from "react";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const MapLegend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const placeTypes = {
    [CitiesTypeOptions.country]: "Country",
    [CitiesTypeOptions.region]: "Region",
    [CitiesTypeOptions.city]: "City",
    [CitiesTypeOptions.neighborhood]: "Neighborhood",
    [CitiesTypeOptions.sight]: "Sight",
  } as const;

  const ratings = [
    { color: ratingColors.best, label: "4.8+", stars: "★★★★★" },
    { color: ratingColors.great, label: "4.5-4.7", stars: "★★★★½" },
    { color: ratingColors.good, label: "4.2-4.4", stars: "★★★★" },
    { color: ratingColors.okay, label: "3.8-4.1", stars: "★★★½" },
    { color: ratingColors.fair, label: "3.4-3.7", stars: "★★★" },
    { color: ratingColors.poor, label: "< 3.4", stars: "★★½" },
  ] as const;

  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-[9999] bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border transition-all duration-300",
        isExpanded ? "h-[500px] w-[320px]" : "h-9 w-auto"
      )}
    >
      {!isExpanded ? (
        <Button
          variant="ghost"
          className="h-9 px-3 gap-2"
          onClick={() => setIsExpanded(true)}
        >
          <Info className="w-4 h-4" />
          <span className="text-sm">Map Legend</span>
        </Button>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="font-medium">Map Legend</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(false)}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Explore different types of places and their ratings on the map
              </p>
            </div>

            {/* Place Types */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-foreground/90">Place Types</h3>
              <div className="grid gap-3">
                {Object.entries(placeTypes).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: markerColors[type as CitiesTypeOptions] 
                      }}
                    />
                    <span className="text-sm text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-foreground/90">Rating Scale</h3>
              <div className="grid gap-3">
                {ratings.map(({ color, label, stars }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground/80">{label}</span>
                      <span className="text-xs text-foreground/60">
                        {stars}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
