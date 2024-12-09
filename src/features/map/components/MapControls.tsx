import { Button } from "@/components/ui/button";
import { Home, Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapControlsProps {
  onZoomChange: (zoom: number) => void;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export const MapControls = ({
  onZoomChange,
  defaultCenter = [20, 0],
  defaultZoom = 2,
}: MapControlsProps) => {
  const map = useMap();

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

  return (
    <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleZoomIn}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleZoomOut}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 shadow-md"
        onClick={handleReset}
      >
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
};
