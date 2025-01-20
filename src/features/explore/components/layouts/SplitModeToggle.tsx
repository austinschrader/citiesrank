/**
 * Toggle control for split view modes (list/split/map).
 * Adapts to mobile/desktop layouts.
 */
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { Camera, Map, SplitSquareVertical } from "lucide-react";

export const SplitModeToggle = () => {
  const { splitMode, setSplitMode } = useMap();

  // Mobile toggle between list and map
  const handleMobileToggle = () => {
    setSplitMode(splitMode === "list" ? "map" : "list");
  };

  return (
    <>
      {/* Mobile View: Simple Toggle */}
      <div className="sm:hidden">
        <button
          onClick={handleMobileToggle}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200",
            "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
            "text-white shadow-sm"
          )}
        >
          {splitMode === "list" ? (
            <Map className="h-3.5 w-3.5" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Desktop View: Full Interface */}
      <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white/5 backdrop-blur-sm">
        <button
          onClick={() => setSplitMode("list")}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
            splitMode === "list"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">Gallery</span>
        </button>

        <button
          onClick={() => setSplitMode("split")}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
            splitMode === "split"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <SplitSquareVertical className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">Split</span>
        </button>

        <button
          onClick={() => setSplitMode("map")}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-lg transition-all duration-200",
            splitMode === "map"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <Map className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">Map</span>
        </button>
      </div>
    </>
  );
};
