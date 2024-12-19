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
import L from "leaflet";

// Zoom level constants for place type visibility
export const ZOOM_LEVELS = {
  COUNTRY: 3,
  REGION: 6,
  CITY: 10,
  NEIGHBORHOOD: 14,
} as const;

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
  mapBounds: L.LatLngBounds | null;
  setMapBounds: (bounds: L.LatLngBounds | null) => void;
  visiblePlaces: MapPlace[];
  setVisiblePlaces: (places: MapPlace[]) => void;
  getVisiblePlaceTypes: (zoom: number) => CitiesTypeOptions[];
  filterPlacesByZoom: (places: MapPlace[], zoom: number, populationCategoryActive?: boolean) => MapPlace[];
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
  
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<MapPlace[]>([]);

  // Get visible place types for current zoom level
  const getVisiblePlaceTypes = (zoom: number): CitiesTypeOptions[] => {
    if (zoom <= ZOOM_LEVELS.COUNTRY) {
      return [CitiesTypeOptions.country];
    } else if (zoom <= ZOOM_LEVELS.REGION) {
      return [CitiesTypeOptions.country, CitiesTypeOptions.region];
    } else if (zoom <= ZOOM_LEVELS.CITY) {
      return [CitiesTypeOptions.region, CitiesTypeOptions.city];
    } else if (zoom <= ZOOM_LEVELS.NEIGHBORHOOD) {
      return [CitiesTypeOptions.city, CitiesTypeOptions.neighborhood];
    } else {
      return [CitiesTypeOptions.neighborhood, CitiesTypeOptions.sight];
    }
  };

  // Filter places based on zoom level
  const filterPlacesByZoom = (
    places: MapPlace[], 
    zoom: number, 
    populationCategoryActive = false
  ): MapPlace[] => {
    const visibleTypes = getVisiblePlaceTypes(zoom);
    return places.filter((place) => {
      if (populationCategoryActive && place.type === CitiesTypeOptions.city) {
        return true;
      }
      return visibleTypes.includes(place.type as CitiesTypeOptions);
    });
  };

  const value = useMemo(
    () => ({
      ...state,
      mapBounds,
      setMapBounds,
      visiblePlaces,
      setVisiblePlaces,
      getVisiblePlaceTypes,
      filterPlacesByZoom,
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
    [state, mapBounds, visiblePlaces]
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
