// file location: src/features/map/components/MapControls.tsx
/**
 * Provides zoom and center reset controls for the map.
 * Handles zoom level changes and map center reset.
 */
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Home, MapPinIcon, Minus, Plus } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useLocation } from "../context/LocationContext";

const DEFAULT_CENTER: [number, number] = [48.5, 10]; // Centered on Germany/Austria
const DEFAULT_ZOOM = 5;

interface MapControlsProps {
  onZoomChange: (zoom: number) => void;
}

export const MapControls = ({ onZoomChange }: MapControlsProps) => {
  const map = useLeafletMap();
  const { setCoordinates } = useLocation();

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

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    const newZoom = (map?.getZoom() || 0) + 1;
    map?.setZoom(newZoom);
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    const newZoom = (map?.getZoom() || 0) - 1;
    map?.setZoom(newZoom);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    map?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  };

  return (
    <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
      <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            map?.locate().on("locationfound", (e) => {
              map.setView(e.latlng, 10);
              setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
            });
          }}
        >
          <MapPinIcon className="h-4 w-4" />
        </Button>
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
    </div>
  );
};
