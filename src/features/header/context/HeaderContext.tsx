import { createContext, useContext, useState } from "react";

export type HeaderMode = "discover" | "lists" | "latest" | "profile" | "favorites" | "places";
export type EnergyMode = "buzzing" | "fresh" | "trending" | "upcoming";
export type TimeRange = "now" | "today" | "week" | "month";
export type ViewMode = "places" | "lists";

interface HeaderContextValue {
  mode: HeaderMode;
  setMode: (mode: HeaderMode) => void;
  energyMode: EnergyMode;
  setEnergyMode: (mode: EnergyMode) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  subtitle: string | null;
  setSubtitle: (subtitle: string | null) => void;
  showControls: boolean;
  setShowControls: (show: boolean) => void;
  exploringCount: number | null;
  setExploringCount: (count: number | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<HeaderMode>("discover");
  const [energyMode, setEnergyMode] = useState<EnergyMode>("buzzing");
  const [timeRange, setTimeRange] = useState<TimeRange>("now");
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [exploringCount, setExploringCount] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("places");
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  return (
    <HeaderContext.Provider
      value={{
        mode,
        setMode,
        energyMode,
        setEnergyMode,
        timeRange,
        setTimeRange,
        subtitle,
        setSubtitle,
        showControls,
        setShowControls,
        exploringCount,
        setExploringCount,
        viewMode,
        setViewMode,
        itemsPerPage,
        setItemsPerPage,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
