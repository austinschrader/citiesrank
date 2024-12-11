import { Button } from "@/components/ui/button";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Building2, Globe2, Landmark, MapPin, Mountain } from "lucide-react";

interface DestinationFilterProps {
  selectedFilter: string | null;
  onFilterSelect: (filter: string) => void;
  selectedDestinationType: CitiesTypeOptions | null;
  onDestinationTypeSelect: (type: CitiesTypeOptions) => void;
  variant?: "mobile" | "desktop";
}

const destinationTypes = [
  {
    type: CitiesTypeOptions.country,
    label: "Countries",
    icon: Globe2,
  },
  {
    type: CitiesTypeOptions.region,
    label: "Regions",
    icon: Mountain,
  },
  {
    type: CitiesTypeOptions.city,
    label: "Cities",
    icon: Building2,
  },
  {
    type: CitiesTypeOptions.neighborhood,
    label: "Neighborhoods",
    icon: MapPin,
  },
  {
    type: CitiesTypeOptions.sight,
    label: "Sights",
    icon: Landmark,
  },
];

export function DestinationFilter({
  selectedFilter,
  onFilterSelect,
  selectedDestinationType,
  onDestinationTypeSelect,
  variant = "desktop",
}: DestinationFilterProps) {
  return (
    <div className={cn("space-y-4", variant === "mobile" && "px-4")}>
      <div className="space-y-2">
        <h3 className="font-medium">Place Type</h3>
        <div
          className={cn(
            "flex gap-2",
            variant === "mobile" ? "flex-col" : "flex-row"
          )}
        >
          {destinationTypes.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={selectedDestinationType === type ? "default" : "outline"}
              className={cn(
                "gap-2",
                variant === "mobile" ? "justify-start w-full" : "px-3"
              )}
              onClick={() => onDestinationTypeSelect(type)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
