// file location: src/features/map/components/MapControls.tsx
/**
 * Provides zoom and center reset controls for the map.
 * Handles zoom level changes and map center reset.
 */
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Home, Minus, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";

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

  // Create a stable debounced zoom handler
  const debouncedZoomChange = useCallback(
    debounce((zoom: number) => {
      onZoomChange(zoom);
    }, 300),
    [onZoomChange]
  );

  useEffect(() => {
    const handleZoomEnd = () => {
      debouncedZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
      debouncedZoomChange.cancel();
    };
  }, [map, debouncedZoomChange]);

  const handleZoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  };

  const handleReset = () => {
    map.setView(defaultCenter, defaultZoom);
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
    </div>
  );
};
