import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { BarChart3, Globe2, LucideIcon, MapPin, Users, X } from "lucide-react";

interface PlaceStatsDialogProps {
  place: CitiesResponse;
  isOpen: boolean;
  onClose: () => void;
}

interface StatConfig {
  key: keyof CitiesResponse | "coordinates";
  label: string;
  icon: LucideIcon;
  format: (value: any) => string;
  color: string;
  bgColor: string;
}

const PLACE_STATS: StatConfig[] = [
  {
    key: "population",
    label: "Population",
    icon: Users,
    format: (value: number | null) => value?.toLocaleString() || "Unknown",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    key: "country",
    label: "Country",
    icon: Globe2,
    format: (value: string) => value || "N/A",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
  },
  {
    key: "coordinates",
    label: "Coordinates",
    icon: MapPin,
    format: (place: CitiesResponse) =>
      `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    key: "averageRating",
    label: "Rating",
    icon: BarChart3,
    format: (value: number | null) =>
      value ? value.toFixed(1) + "/5.0" : "New",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
];

export const PlaceStatsDialog = ({
  place,
  isOpen,
  onClose,
}: PlaceStatsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-none text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {place.name} Statistics
          </DialogTitle>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5"
        >
          <span className="text-sm text-white/80">Close</span>
          <X className="w-3.5 h-3.5 text-white/60" />
        </button>
        <div className="grid grid-cols-2 gap-6 p-6 w-full">
          {PLACE_STATS.map((stat, index) => {
            const value =
              stat.key === "coordinates"
                ? stat.format(place)
                : stat.format(place[stat.key]);

            const Icon = stat.icon;

            return (
              <div
                key={stat.key}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl",
                  stat.bgColor,
                  "transform hover:scale-105 transition-all duration-300",
                  "shadow-lg"
                )}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className={cn("rounded-full p-2 mb-2", stat.bgColor)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <span className="text-sm font-medium text-white/80 mb-1">
                  {stat.label}
                </span>
                <span className="text-lg font-bold text-white">{value}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
