import { useMap } from "@/features/map/context/MapContext";
import { useCities } from "@/features/places/context/CitiesContext";
import {
  PopulationCategory,
  useFilters,
} from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { markerColors } from "@/lib/utils/colors";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useState } from "react";

interface MapLegendProps {
  isStatsMinimized: boolean;
  setIsStatsMinimized: (value: boolean) => void;
}

const citySizeEmojis: Record<PopulationCategory, string> = {
  megacity: "🌇",
  city: "🏙️",
  town: "🏰",
  village: "🏡",
};

const typeEmojis: Record<CitiesTypeOptions, string> = {
  [CitiesTypeOptions.country]: "🌎",
  [CitiesTypeOptions.region]: "🗺️",
  [CitiesTypeOptions.city]: "🌆",
  [CitiesTypeOptions.neighborhood]: "🏘️",
  [CitiesTypeOptions.sight]: "🎯",
};

export const MapLegend = ({
  isStatsMinimized,
  setIsStatsMinimized,
}: MapLegendProps) => {
  const [isCitySizesExpanded, setIsCitySizesExpanded] = useState(false);
  const { visiblePlacesInView: placesInView } = useMap();
  const { cities: filteredPlaces } = useCities();
  const { filters, handleTypeClick, handlePopulationSelect, getTypeCounts } =
    useFilters();
  const { mapBounds } = useMap();

  // Calculate counts by type
  const typeCounts = getTypeCounts(filteredPlaces);
  const typeCountsInView = getTypeCounts(placesInView);

  return (
    <div className="absolute left-4 top-4 z-10">
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 w-[280px]">
        {/* Header with total count */}
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">
                  {filteredPlaces.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {filteredPlaces.length === 1 ? "place" : "places"}
                </span>
              </div>
              {mapBounds && placesInView.length !== filteredPlaces.length && (
                <div className="text-xs text-muted-foreground mt-1">
                  {placesInView.length} in current view
                </div>
              )}
            </div>
            <button
              onClick={() => setIsStatsMinimized(!isStatsMinimized)}
              className="p-1 hover:bg-accent rounded-full transition-colors"
            >
              {isStatsMinimized ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Active Filters Summary */}
          <div
            className={cn(
              "flex gap-2 mt-2 flex-wrap transition-all duration-150 overflow-hidden",
              isStatsMinimized ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
            )}
          >
            {filters.averageRating && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Star className="w-3 h-3 mr-1" />
                {filters.averageRating}+
              </span>
            )}
            {filters.populationCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {filters.populationCategory.charAt(0).toUpperCase() +
                  filters.populationCategory.slice(1)}
              </span>
            )}
            {filters.activeTypes.length !==
              Object.values(CitiesTypeOptions).length && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {filters.activeTypes.length} types
              </span>
            )}
          </div>
        </div>

        {/* Type breakdown */}
        <div
          className={cn(
            "transition-all duration-150 divide-y divide-border/50 overflow-hidden",
            isStatsMinimized ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
          )}
        >
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
                        ? "scale-125"
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
                    className="text-lg mr-1"
                    role="img"
                    aria-label={`${type} emoji`}
                  >
                    {typeEmojis[type]}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium capitalize transition-all duration-200"
                    )}
                    style={{
                      color: filters.activeTypes.includes(type)
                        ? "var(--marker-color)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {type}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm transition-all duration-200",
                      filters.activeTypes.includes(type)
                        ? "font-semibold"
                        : "font-medium text-muted-foreground"
                    )}
                    style={{
                      color: filters.activeTypes.includes(type)
                        ? "var(--marker-color)"
                        : undefined,
                    }}
                  >
                    {typeCounts[type].toLocaleString()}
                  </span>
                  {mapBounds && typeCountsInView[type] !== typeCounts[type] && (
                    <span
                      className={cn(
                        "text-xs transition-all duration-200",
                        filters.activeTypes.includes(type)
                          ? "opacity-80"
                          : "opacity-40"
                      )}
                      style={{
                        color: filters.activeTypes.includes(type)
                          ? "var(--marker-color)"
                          : undefined,
                      }}
                    >
                      ({typeCountsInView[type]} in view)
                    </span>
                  )}
                  {type === CitiesTypeOptions.city &&
                    filters.activeTypes.includes(type) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCitySizesExpanded(!isCitySizesExpanded);
                        }}
                        className="p-1 hover:bg-accent/50 rounded-full"
                      >
                        <ChevronUp
                          className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            !isCitySizesExpanded && "rotate-180"
                          )}
                          style={{
                            color: filters.activeTypes.includes(type)
                              ? "var(--marker-color)"
                              : "var(--muted-foreground)",
                          }}
                        />
                      </button>
                    )}
                </div>
              </div>

              {/* Nested City Size Filters */}
              {type === CitiesTypeOptions.city &&
                filters.activeTypes.includes(CitiesTypeOptions.city) && (
                  <div
                    className={cn(
                      "divide-y divide-border/50 overflow-hidden transition-all duration-200",
                      isCitySizesExpanded
                        ? "max-h-[200px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {(["megacity", "city", "town", "village"] as const).map(
                      (size) => (
                        <div
                          key={size}
                          onClick={() =>
                            handlePopulationSelect(size as PopulationCategory)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePopulationSelect(
                                size as PopulationCategory
                              );
                            }
                          }}
                          className={cn(
                            "w-full px-5 py-2 flex items-center justify-between",
                            "transition-all duration-200 ease-in-out text-sm",
                            "pl-7",
                            filters.populationCategory === size
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-200",
                                filters.populationCategory === size
                                  ? "opacity-100 scale-125"
                                  : "opacity-40"
                              )}
                              style={{
                                backgroundColor:
                                  markerColors[CitiesTypeOptions.city],
                              }}
                            />
                            <span
                              className="text-base"
                              role="img"
                              aria-label={`${size} emoji`}
                            >
                              {citySizeEmojis[size as PopulationCategory]}
                            </span>
                            <span className="capitalize">{size}</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
