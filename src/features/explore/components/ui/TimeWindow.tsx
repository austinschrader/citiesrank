/**
 * Dropdown component for selecting energy mode and time range.
 * Pure UI - receives all data and handlers as props.
 */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHeader } from "@/context/HeaderContext";
import { EnergyMode, TimeRange } from "@/features/explore/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Flame, Sparkles, Timer, Zap } from "lucide-react";
import React from "react";

const energyModeConfig: Record<EnergyMode, { icon: React.ElementType; label: string }> = {
  buzzing: { icon: Flame, label: "Hot" },
  fresh: { icon: Sparkles, label: "New" },
  trending: { icon: Zap, label: "Rising" },
  upcoming: { icon: Timer, label: "Soon" },
};

const timeRangeConfig: Record<TimeRange, string> = {
  now: "Now",
  today: "Today",
  week: "Week",
  month: "Month",
};

interface TimeWindowProps {
  className?: string;
}

export const TimeWindow = ({ className }: TimeWindowProps) => {
  const { energyMode, timeRange, setEnergyMode, setTimeRange } = useHeader();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Energy Mode Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-2 text-md font-medium text-indigo-600 w-[100px] justify-between"
          >
            <div className="flex items-center gap-2">
              {React.createElement(energyModeConfig[energyMode].icon, {
                className: cn(
                  "h-4 w-4 flex-shrink-0",
                  energyMode === "buzzing" && "text-orange-500",
                  energyMode === "fresh" && "text-emerald-500",
                  energyMode === "trending" && "text-yellow-500",
                  energyMode === "upcoming" && "text-blue-500"
                ),
              })}
              {energyModeConfig[energyMode].label}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[99999]">
          {(Object.keys(energyModeConfig) as EnergyMode[]).map((mode) => (
            <DropdownMenuItem
              key={mode}
              onClick={() => setEnergyMode(mode)}
              className="gap-2 text-md font-medium text-indigo-600"
            >
              {React.createElement(energyModeConfig[mode].icon, {
                className: cn(
                  "h-4 w-4 flex-shrink-0",
                  mode === "buzzing" && "text-orange-500",
                  mode === "fresh" && "text-emerald-500",
                  mode === "trending" && "text-yellow-500",
                  mode === "upcoming" && "text-blue-500"
                ),
              })}
              {energyModeConfig[mode].label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Time Range Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-2 text-md font-medium text-indigo-600 w-[100px] justify-between"
          >
            {timeRangeConfig[timeRange]}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[99999]">
          {(Object.keys(timeRangeConfig) as TimeRange[]).map((range) => (
            <DropdownMenuItem
              key={range}
              onClick={() => setTimeRange(range)}
              className="gap-2 text-md font-medium text-indigo-600"
            >
              {timeRangeConfig[range]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
