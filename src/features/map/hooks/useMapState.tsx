// src/features/map/hooks/useMapState.tsx
import { useState } from "react";
import { MapViewState } from "../types";

const getGeographicLevel = (zoom: number): MapViewState["geographicLevel"] => {
  if (zoom <= 3) return "country";
  if (zoom <= 6) return "region";
  if (zoom <= 10) return "city";
  if (zoom <= 14) return "neighborhood";
  return "sight";
};

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapViewState>({
    zoom: 2,
    center: [20, 0],
    geographicLevel: "country",
  });

  const setZoom = (zoom: number) => {
    setMapState((prev) => ({
      ...prev,
      zoom,
      geographicLevel: getGeographicLevel(zoom),
    }));
  };

  return { mapState, setZoom };
};
