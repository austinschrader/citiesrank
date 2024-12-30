import { useMap } from "@/features/map/context/MapContext";
import { useSelection } from "@/features/map/context/SelectionContext";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { DollarSign, Footprints, Train, Users, X } from "lucide-react";
import { forwardRef, useState } from "react";
import { PlaceCard } from "../cards/PlaceCard";

type PlaceStatKey = keyof Pick<
  CitiesResponse,
  "cost" | "population" | "transitScore" | "walkScore"
>;

interface PlaceStat {
  key: PlaceStatKey;
  label: string;
  icon: any;
  format: (value: any) => string;
  color: string;
  bgColor: string;
}

const PLACE_STATS: PlaceStat[] = [
  {
    key: "population",
    label: "Population",
    icon: Users,
    format: (value: { toLocaleString: () => any }) => value.toLocaleString(),
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    key: "transitScore",
    label: "Transit Score",
    icon: Train,
    format: (value: any) => `${value}`,
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
  },
  {
    key: "walkScore",
    label: "Walk Score",
    icon: Footprints,
    format: (value: any) => `${value}`,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    key: "cost",
    label: "Cost of Living",
    icon: DollarSign,
    format: (value: any) => `$${value}`,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
];

interface PlaceCardGridProps {
  places: CitiesResponse[];
  className?: string;
}

const StatsOverlay = ({ place }: { place: CitiesResponse }) => {
  return (
    <div className="stats-overlay absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.closest(".stats-overlay")?.classList.add("hidden");
        }}
        className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5"
      >
        <span className="text-sm text-white/80">Dismiss</span>
        <X className="w-3.5 h-3.5 text-white/60" />
      </button>
      <div className="grid grid-cols-2 gap-6 p-6 w-full">
        {PLACE_STATS.map((stat, index) => {
          const Icon = stat.icon;
          const value = place[stat.key];
          if (value === undefined) return null;

          return (
            <div
              key={stat.key}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl",
                stat.bgColor,
                "transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105",
                "shadow-lg"
              )}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className={cn("rounded-full p-2 mb-2", stat.bgColor)}>
                <Icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className="text-sm font-medium text-white/80 mb-1">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-white">
                {stat.format(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PlaceCardGrid = forwardRef<HTMLDivElement, PlaceCardGridProps>(
  ({ places, className }, ref) => {
    const { setCenter, viewMode } = useMap();
    const { selectedPlace, setSelectedPlace } = useSelection();
    const [hoveredPlace, setHoveredPlace] = useState<CitiesResponse | null>(
      null
    );

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 auto-rows-[minmax(min-content,max-content)]",
          viewMode === "list"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {places.map((place) => (
          <div
            key={place.id}
            data-id={place.id}
            className={cn(
              "group relative rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200",
              selectedPlace?.id === place.id && viewMode == "list"
                ? "ring-2 ring-rose-500 shadow-lg"
                : ""
            )}
            onMouseEnter={() => {
              setHoveredPlace(place);
              if (viewMode == "list") {
                setSelectedPlace(place);
              }
            }}
            onMouseLeave={() => {
              setHoveredPlace(null);
              if (viewMode == "list") {
                setSelectedPlace(null);
              }
            }}
          >
            <PlaceCard
              city={place}
              onClick={() => {
                setCenter([place.latitude, place.longitude]);
              }}
            />
            {hoveredPlace?.id === place.id && <StatsOverlay place={place} />}
          </div>
        ))}
      </div>
    );
  }
);

export default PlaceCardGrid;
