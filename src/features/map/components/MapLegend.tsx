import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { markerColors, ratingColors } from "@/lib/utils/colors";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useState } from "react";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

export const MapLegend = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Info className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Map Legend</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Place Types */}
            <div className="space-y-2">
              <h3 className="font-medium">Place Types</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(placeTypes).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: markerColors[type as CitiesTypeOptions] }}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-2">
              <h3 className="font-medium">Ratings</h3>
              <div className="grid grid-cols-1 gap-2">
                {ratings.map(({ color, label, stars }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{label}</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {stars}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
