// file location: src/features/map/components/MapControls.tsx
import { Button } from "@/components/ui/button";
import { Plus, Minus, Home, RefreshCw, ArrowDown } from "lucide-react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useEffect } from "react";
import { useMap } from "../context/MapContext";

interface MapControlsProps {
  onZoomChange: (zoom: number) => void;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export const MapControls = ({
  onZoomChange,
  defaultCenter = [48.5, 10], // Centered on Germany/Austria
  defaultZoom = 5,
}: MapControlsProps) => {
  const map = useLeafletMap();
  const { resetDistribution, hasMorePlaces, loadMorePlaces } = useMap();

  useEffect(() => {
    const handleZoomEnd = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, onZoomChange]);

  const handleZoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  };

  const handleReset = () => {
    map.setView(defaultCenter, defaultZoom);
  };

  const handleRefresh = () => {
    resetDistribution();
  };

  return (
    <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleZoomIn}
        title="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleZoomOut}
        title="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleReset}
        title="Reset view"
      >
        <Home className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleRefresh}
        title="Refresh distribution"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      {hasMorePlaces && (
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 shadow-md"
          onClick={loadMorePlaces}
          title="Load more places"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
