import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Flame, Sparkles, Timer, Zap } from "lucide-react";
import React from "react";

type EnergyMode = "buzzing" | "fresh" | "trending" | "upcoming";
type TimeRange = "now" | "today" | "week" | "month";

const energyModes = {
  buzzing: {
    icon: Flame,
    label: "Hot",
  },
  fresh: {
    icon: Sparkles,
    label: "New",
  },
  trending: {
    icon: Zap,
    label: "Rising",
  },
  upcoming: {
    icon: Timer,
    label: "Soon",
  },
};

const timeRanges = {
  now: "Now",
  today: "Today",
  week: "Week",
  month: "Month",
};

interface TimeWindowProps {
  className?: string;
  energyMode: EnergyMode;
  timeRange: TimeRange;
  onEnergyChange: (mode: EnergyMode) => void;
  onTimeChange: (range: TimeRange) => void;
}

export const TimeWindow = ({
  className,
  energyMode,
  timeRange,
  onEnergyChange,
  onTimeChange,
}: TimeWindowProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Energy Mode Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 py-1.5 gap-2 text-md font-medium text-indigo-600 w-[100px] justify-between"
          >
            <div className="flex items-center gap-2">
              {React.createElement(energyModes[energyMode].icon, {
                className: cn(
                  "h-4 w-4 flex-shrink-0",
                  energyMode === "buzzing" && "text-orange-500",
                  energyMode === "fresh" && "text-purple-500",
                  energyMode === "trending" && "text-blue-500",
                  energyMode === "upcoming" && "text-green-500"
                ),
              })}
              <span className="text-md font-medium text-indigo-600">
                {energyModes[energyMode].label}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[150px]">
          {Object.entries(energyModes).map(([key, mode]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onEnergyChange(key as EnergyMode)}
              className="gap-2 text-md font-medium text-indigo-600"
            >
              {React.createElement(mode.icon, {
                className: cn(
                  "h-4 w-4",
                  key === "buzzing" && "text-orange-500",
                  key === "fresh" && "text-purple-500",
                  key === "trending" && "text-blue-500",
                  key === "upcoming" && "text-green-500"
                ),
              })}
              <span className="font-medium">{mode.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Time Range */}
      {(energyMode === "buzzing" || energyMode === "trending") && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 py-1.5 gap-2 text-md font-medium text-indigo-600 w-[100px] justify-between"
            >
              <span className="text-md font-medium text-indigo-600">
                {timeRanges[timeRange]}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[150px]">
            {Object.entries(timeRanges).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onTimeChange(key as TimeRange)}
                className="gap-2 text-md font-medium text-indigo-600"
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
