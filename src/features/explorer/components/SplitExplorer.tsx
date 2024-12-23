import { FiltersBar } from "@/features/explorer/components/FiltersBar";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { SpaceView } from "@/features/space/components/SpaceView";
import { cn } from "@/lib/utils";

export const SplitExplorer = () => {
  const { viewMode } = useMap();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col h-full">
        <FiltersBar />
        <div className="flex-1 flex overflow-hidden">
          <div
            key={viewMode}
            className={cn(
              "flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden",
              viewMode === "map"
                ? "w-0 invisible"
                : viewMode === "list"
                ? "w-full"
                : "w-1/2"
            )}
          >
            <div className="flex-1 overflow-y-auto">
              <SpaceView />
            </div>
          </div>
          <div
            key={`map-${viewMode}`}
            className={cn(
              "relative transition-all duration-300 ease-in-out overflow-hidden",
              viewMode === "list"
                ? "w-0 invisible"
                : viewMode === "map"
                ? "w-full"
                : "w-1/2"
            )}
          >
            <div className="absolute inset-0">
              <CityMap className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
