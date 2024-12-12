// src/features/places/components/cards/PlaceTypeIndicator.tsx
/**
 * Displays the type indicator badge for a place card
 */
import { Badge } from "@/components/ui/badge";
import { getPlaceTypeInfo } from "@/features/places/utils/placeUtils";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";

interface PlaceTypeIndicatorProps {
  type: CitiesTypeOptions;
}

export const PlaceTypeIndicator = ({ type }: PlaceTypeIndicatorProps) => {
  const typeInfo = getPlaceTypeInfo([type]);
  const Icon = typeInfo.icon;

  return (
    <Badge
      className={`absolute bottom-3 right-3 z-30 flex items-center gap-2 px-3 py-1.5 
                text-sm font-medium capitalize shadow-lg backdrop-blur-sm
                group-hover:scale-110 group-hover:translate-x-0 ${typeInfo.color}`}
    >
      <Icon size={16} className="shrink-0" />
      {type}
    </Badge>
  );
};
