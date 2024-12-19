// file location: src/features/map/context/MapContext.tsx
/**
 * Global map state provider used by map components to share state and interactions.
 * Manages zoom, center, selected place and geographic level. Used by CityMap and
 * its child components via useMap hook.
 */

import { LatLngTuple } from "leaflet";
import React, { createContext, useContext, useMemo, useState } from "react";
import L from "leaflet";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { MapPlace } from "../types";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";
import { calculateMapBounds } from "../utils/mapUtils";
import { Feature, FeatureCollection } from "geojson";

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
  getPlaceGeoJson: (place: MapPlace) => Promise<FeatureCollection>;
  calculateMapBounds: (place: MapPlace) => { center: LatLngTuple; zoom: number };
  getGeographicLevel: (zoom: number) => CitiesTypeOptions;
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

  const setZoom = (zoom: number) => {
    setState((prev) => ({
      ...prev,
      zoom,
      geographicLevel: getGeographicLevel(zoom),
    }));
  };

  const setCenter = (center: LatLngTuple) => {
    setState((prev) => ({ ...prev, center }));
  };

  const selectPlace = (place: MapPlace | null) => {
    setState((prev) => ({ ...prev, selectedPlace: place }));
  };

  const resetView = () => {
    setState((prev) => ({
      ...prev,
      zoom: DEFAULT_ZOOM,
      center: DEFAULT_CENTER,
      selectedPlace: null,
    }));
  };

  const getGeographicLevel = (zoom: number): CitiesTypeOptions => {
    if (zoom <= ZOOM_LEVELS.COUNTRY) return CitiesTypeOptions.country;
    if (zoom <= ZOOM_LEVELS.REGION) return CitiesTypeOptions.region;
    if (zoom <= ZOOM_LEVELS.CITY) return CitiesTypeOptions.city;
    if (zoom <= ZOOM_LEVELS.NEIGHBORHOOD) return CitiesTypeOptions.neighborhood;
    return CitiesTypeOptions.sight;
  };

  const getVisiblePlaceTypes = (zoom: number): CitiesTypeOptions[] => {
    const level = getGeographicLevel(zoom);
    switch (level) {
      case CitiesTypeOptions.country:
        return [CitiesTypeOptions.country];
      case CitiesTypeOptions.region:
        return [CitiesTypeOptions.country, CitiesTypeOptions.region];
      case CitiesTypeOptions.city:
        return [CitiesTypeOptions.country, CitiesTypeOptions.region, CitiesTypeOptions.city];
      case CitiesTypeOptions.neighborhood:
        return [CitiesTypeOptions.city, CitiesTypeOptions.neighborhood];
      case CitiesTypeOptions.sight:
        return [CitiesTypeOptions.neighborhood, CitiesTypeOptions.sight];
      default:
        return Object.values(CitiesTypeOptions);
    }
  };

  const filterPlacesByZoom = (
    places: MapPlace[],
    zoom: number,
    populationCategoryActive = false
  ): MapPlace[] => {
    const visibleTypes = getVisiblePlaceTypes(zoom);
    return places.filter((place) => {
      if (!place.type) return false;
      if (populationCategoryActive) {
        return place.type === CitiesTypeOptions.city;
      }
      return visibleTypes.includes(place.type as CitiesTypeOptions);
    });
  };

  const value = {
    ...state,
    setZoom,
    setCenter,
    selectPlace,
    resetView,
    mapBounds,
    setMapBounds,
    visiblePlaces,
    setVisiblePlaces,
    getVisiblePlaceTypes,
    filterPlacesByZoom,
    getPlaceGeoJson,
    calculateMapBounds,
    getGeographicLevel,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
