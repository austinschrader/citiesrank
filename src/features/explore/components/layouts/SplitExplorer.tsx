/**
 * Layout component that:
 * - Manages pagination state
 * - Handles infinite scroll
 * - Renders appropriate panel based on content type
 *
 * Data flow: MapContext -> SplitExplorer -> Panel components
 * Pure layout - no filtering/visibility logic
 */
import { useHeader } from "@/context/HeaderContext";
import { FiltersBar } from "@/features/explore/components/ui/FiltersBar";
import { ListsPanel } from "@/features/explore/components/ui/ListsPanel";
import { PlacesPanel } from "@/features/explore/components/ui/PlacesPanel";
import { CityMap } from "@/features/map/components/CityMap";
import { useMap } from "@/features/map/context/MapContext";
import { cn } from "@/lib/utils";
import Split from "react-split";

export const SplitExplorer = () => {
  const {
    splitMode,
    hasMore,
    loadMore,
    isLoadingMore,
    paginatedFilteredPlaces,
  } = useMap();
  const { contentType } = useHeader();

  return (
    <div className="h-full flex flex-col">
      <FiltersBar paginatedFilteredPlaces={paginatedFilteredPlaces} />
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
            {contentType === "places" ? (
              <PlacesPanel
                isLoadingMore={isLoadingMore}
                paginatedFilteredPlaces={paginatedFilteredPlaces}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            ) : (
              <ListsPanel />
            )}
          </div>

          <div
            key={`map-${splitMode}`}
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              splitMode === "list"
                ? "w-0"
                : splitMode === "map"
                ? "flex-1"
                : "flex-1",
              splitMode === "list" && "hidden"
            )}
          >
            <div className="absolute inset-0">
              <CityMap className="h-full" />
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
};
