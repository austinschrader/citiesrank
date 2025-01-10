// src/features/places/components/cards/PlaceTypeIndicator.tsx
/**
 * Displays the type indicator badge for a place card
 */
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPlaceTypeInfo } from "@/features/places/utils/placeUtils";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

interface PlaceTypeIndicatorProps {
  type: CitiesTypeOptions;
}

export const PlaceTypeIndicator = ({ type }: PlaceTypeIndicatorProps) => {
  const typeInfo = getPlaceTypeInfo([type]);
  const Icon = typeInfo.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`absolute bottom-3 right-3 z-30 p-1.5 
                      shadow-lg backdrop-blur-sm
                      group-hover:scale-110 ${typeInfo.color}`}
          >
            <Icon size={16} className="shrink-0" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">{type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
