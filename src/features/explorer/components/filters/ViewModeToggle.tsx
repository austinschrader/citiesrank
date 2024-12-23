import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import { Layout, List, Map, Rows } from "lucide-react";

export const ViewModeToggle = () => {
  const { viewMode, setViewMode } = useMap();

  // Mobile toggle between list and map
  const handleMobileToggle = () => {
    setViewMode(viewMode === "list" ? "map" : "list");
  };

  return (
    <>
      {/* Mobile View: Simple Toggle */}
      <div className="sm:hidden">
        <button
          onClick={handleMobileToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200",
            "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
            "text-white shadow-sm"
          )}
        >
          {viewMode === "list" ? (
            <Map className="h-4 w-4" />
          ) : (
            <List className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Desktop View: Full Interface */}
      <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm">
        {[
          { mode: "list" as const, icon: Rows, label: "Space" },
          {
            mode: "split" as const,
            icon: Layout,
            label: "MapSpace",
          },
          { mode: "map" as const, icon: Map, label: "Map" },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200",
              viewMode === mode
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/10",
              "relative overflow-hidden group"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium capitalize hidden sm:inline">
              {label}
            </span>
            {viewMode === mode && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </>
  );
};
