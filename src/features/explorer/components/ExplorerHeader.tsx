import { TimeWindow } from "@/features/explorer/components/TimeWindow";
import { useMap } from "@/features/map/context/MapContext";
import { Activity, Users } from "lucide-react";
import { useState } from "react";

type EnergyMode = "buzzing" | "fresh" | "trending" | "upcoming";
type TimeRange = "now" | "today" | "week" | "month";

export const ExplorerHeader = () => {
  const { viewMode } = useMap();
  const [energyMode, setEnergyMode] = useState<EnergyMode>("buzzing");
  const [timeRange, setTimeRange] = useState<TimeRange>("now");

  const getContextMessage = () => {
    switch (energyMode) {
      case "buzzing":
        return "The Mission and Hayes Valley are on fire right now ";
      case "fresh":
        return "Fresh spots and stories just dropped ";
      case "trending":
        return "These places are taking off ";
      case "upcoming":
        return "Coming up next ";
      default:
        return "";
    }
  };

  return (
    <div className="sticky top-0 z-10 p-4 border-b bg-background/95 backdrop-blur-lg">
      <div className="flex items-center justify-between">
        {/* Left: Title and Activity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-purple-500" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              The Space Feed
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">142 exploring nearby</span>
          </div>
        </div>

        {/* Center: Time Window */}
        <TimeWindow
          energyMode={energyMode}
          timeRange={timeRange}
          onEnergyChange={setEnergyMode}
          onTimeChange={setTimeRange}
        />
      </div>

      {/* View Context */}
      {viewMode === "map" && (
        <div className="mt-3 text-sm text-muted-foreground">
          {getContextMessage()}
        </div>
      )}
    </div>
  );
};
