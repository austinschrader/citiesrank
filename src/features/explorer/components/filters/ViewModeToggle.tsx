import { cn } from "@/lib/utils";
import { LayoutGrid, Map, SplitSquareHorizontal } from "lucide-react";
import { ViewMode, useMap } from "@/features/map/context/MapContext";

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
            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
            "bg-primary text-primary-foreground shadow-sm"
          )}
        >
          {viewMode === "list" ? (
            <Map className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Desktop View: Full Interface */}
      <div className="hidden sm:flex items-center gap-1">
        {[
          { mode: "list" as const, icon: LayoutGrid, label: "List view" },
          {
            mode: "split" as const,
            icon: SplitSquareHorizontal,
            label: "Split view",
          },
          { mode: "map" as const, icon: Map, label: "Map view" },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
              viewMode === mode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium capitalize hidden sm:inline">
              {mode}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
