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
    <div className="relative">
      <Badge
        className={`type-badge absolute bottom-3 right-3 z-30 p-1.5 
                  shadow-lg backdrop-blur-sm ${typeInfo.color}`}
      >
        <Icon size={16} className="shrink-0" />
        <div className="absolute opacity-0 invisible type-badge-hover:opacity-100 type-badge-hover:visible -top-10 right-0 transform transition-all duration-200 ease-out z-40">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-lg border border-border/20 whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <Icon size={12} className={typeInfo.color} />
              <span className="capitalize text-[11px] font-medium text-gray-700 dark:text-gray-200">
                {type}
              </span>
            </div>
          </div>
        </div>
      </Badge>
    </div>
  );
};
