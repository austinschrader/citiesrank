/**
 * Layout component that manages split view between map and panels.
 * Pure layout component - handles only view composition and sizing.
 *
 * Data flow: MapContext -> SplitExplorer -> Panel components
 */
import { ContentPanel } from "@/features/explore/components/ui/ContentPanel";
import { FiltersBar } from "@/features/explore/components/ui/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import Split from "react-split";

export const SplitExplorer = () => {
  const { splitMode } = useMap();

  return (
    <div className="h-full flex flex-col">
      <FiltersBar />
      <div className="flex-1 overflow-hidden">
        <Split
          className="h-full flex"
          sizes={
            splitMode === "list"
              ? [100, 0]
              : splitMode === "map"
              ? [0, 100]
              : [50, 50]
          }
          minSize={0}
          gutterSize={4}
          snapOffset={0}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              splitMode === "list"
                ? "flex-1"
                : splitMode === "map"
                ? "w-0"
                : "flex-1",
              splitMode === "map" && "hidden"
            )}
          >
            <ContentPanel />
          </div>
          <div
            key={`map-${splitMode}`}
            className={cn(
              "transition-all duration-300 ease-in-out",
              splitMode === "map"
                ? "flex-1"
                : splitMode === "list"
                ? "w-0"
                : "flex-1",
              splitMode === "list" && "hidden"
            )}
          >
            <CityMap />
          </div>
        </Split>
      </div>
    </div>
  );
};
