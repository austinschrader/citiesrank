import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type HeaderMode =
  | "discover"
  | "lists"
  | "latest"
  | "profile"
  | "favorites"
  | "places";
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
  isFiltersCollapsed: boolean;
  setIsFiltersCollapsed: (collapsed: boolean) => void;
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
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const location = useLocation();

  // Update header mode based on current route
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/explore") {
      setMode("discover");
    } else if (location.pathname.startsWith("/lists")) {
      setMode("lists");
    } else if (location.pathname === "/feed") {
      setMode("latest");
    } else if (location.pathname === "/profile") {
      setMode("profile");
    } else if (location.pathname === "/favorites") {
      setMode("favorites");
    }
  }, [location.pathname]);

  const value = {
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
    isFiltersCollapsed,
    setIsFiltersCollapsed,
  };

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
