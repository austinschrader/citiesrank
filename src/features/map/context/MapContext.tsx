// file location: src/features/map/context/MapContext.tsx
/**
 * Global map state provider used by map components to share state and interactions.
 * Manages zoom, center, selected place and geographic level. Used by CityMap and
 * its child components via useMap hook.
 */

import { mapService } from "@/features/map/services/mapService";
import { MapPlace } from "@/features/map/types";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { LatLngTuple } from "leaflet";
import React, { createContext, useContext, useMemo, useState } from "react";

interface MapState {
  zoom: number;
  center: LatLngTuple;
  geographicLevel: CitiesTypeOptions;
  selectedPlace: MapPlace | null;
}

interface MapContextValue extends MapState {
  setZoom: (zoom: number) => void;
  setCenter: (center: LatLngTuple) => void;
  selectPlace: (place: MapPlace | null) => void;
  resetView: () => void;
}

const DEFAULT_CENTER: LatLngTuple = [20, 0];
const DEFAULT_ZOOM = 3;

export const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MapState>({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    geographicLevel: CitiesTypeOptions.country,
    selectedPlace: null,
  });

  const value = useMemo(
    () => ({
      ...state,
      setZoom: (zoom: number) => {
        setState((prev) => ({
          ...prev,
          zoom,
          geographicLevel: mapService.getGeographicLevel(zoom),
        }));
      },
      setCenter: (center: LatLngTuple) => {
        setState((prev) => ({ ...prev, center }));
      },
      selectPlace: (place: MapPlace | null) => {
        if (place) {
          const bounds = mapService.calculateBounds(place);
          setState((prev) => ({
            ...prev,
            selectedPlace: place,
            center: bounds.center,
            zoom: bounds.zoom,
            geographicLevel: mapService.getGeographicLevel(bounds.zoom),
          }));
        } else {
          setState((prev) => ({ ...prev, selectedPlace: null }));
        }
      },
      resetView: () => {
        setState({
          zoom: DEFAULT_ZOOM,
          center: DEFAULT_CENTER,
          geographicLevel: CitiesTypeOptions.country,
          selectedPlace: null,
        });
      },
    }),
    [state]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

// Hook stays in the same file as its context
export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within MapProvider");
  }
  return context;
}
