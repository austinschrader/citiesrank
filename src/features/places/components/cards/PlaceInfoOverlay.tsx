// src/features/places/components/cards/PlaceInfoOverlay.tsx
/**
 * Info overlay shown on place cards displaying basic information.
 * Uses dual gradients for optimal text contrast while preserving image brightness.
 */
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { getCountryCode } from "@/lib/utils/countryUtils";
import * as Flags from "country-flag-icons/react/3x2";
import { PlaceCardProps } from "../../types";

interface PlaceInfoOverlayProps {
  city: CitiesResponse;
  variant: PlaceCardProps["variant"];
}

export const PlaceInfoOverlay = ({ city, variant }: PlaceInfoOverlayProps) => {
  return (
    <>
      {/* Base gradient for overall image contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content with its own gradient for text readability */}
      <div className="absolute inset-0 z-20">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-semibold text-white text-left mb-1 drop-shadow-lg">
            {city.name}
          </h3>
          <div className="flex items-center gap-2">
            {(() => {
              const countryCode = getCountryCode(city.country);
              if (countryCode && countryCode in Flags) {
                const FlagComponent = Flags[countryCode as keyof typeof Flags];
                return (
                  <div className="h-4 w-5 rounded overflow-hidden">
                    <FlagComponent className="w-full h-full object-cover" />
                  </div>
                );
              }
              return null;
            })()}
            <p className="text-sm font-medium text-white/90 drop-shadow-lg">
              {city.country}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
