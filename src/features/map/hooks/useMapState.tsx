// src/features/map/hooks/useMapState.ts
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { useState } from "react";
import { mapService } from "../services/mapService";
import { MapViewState } from "../types";

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;

export const useMapState = () => {
  const [mapState, setMapState] = useState<MapViewState>({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    geographicLevel: CitiesTypeOptions.country,
  });

  const setZoom = (zoom: number) => {
    setMapState((prev) => ({
      ...prev,
      zoom,
      geographicLevel: mapService.getGeographicLevel(zoom),
    }));
  };

  const setCenter = (center: [number, number]) => {
    setMapState((prev) => ({
      ...prev,
      center,
    }));
  };

  const resetView = () => {
    setMapState({
      zoom: DEFAULT_ZOOM,
      center: DEFAULT_CENTER,
      geographicLevel: CitiesTypeOptions.country,
    });
  };

  return {
    mapState,
    setZoom,
    setCenter,
    resetView,
  } as const;
};

export type UseMapStateReturn = ReturnType<typeof useMapState>;
