// file location: src/features/map/context/MapContext.tsx
/**
 * Global map state provider used by map components to share state and interactions.
 * Manages zoom, center, selected place and geographic level. Used by CityMap and
 * its child components via useMap hook.
 */

import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { FeatureCollection } from "geojson";
import L, { LatLngTuple } from "leaflet";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MapPlace } from "../types";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";
import { calculateMapBounds } from "../utils/mapUtils";

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
  visiblePlacesInView: MapPlace[];
  numPrioritizedToShow: number;
  setNumPrioritizedToShow: React.Dispatch<React.SetStateAction<number>>;
  prioritizedPlaces: MapPlace[];
  getVisiblePlacesForCurrentView: (allPlaces: MapPlace[]) => MapPlace[];
  getVisiblePlaceTypes: (zoom: number) => CitiesTypeOptions[];
  filterPlacesByZoom: (
    places: MapPlace[],
    zoom: number,
    populationCategoryActive?: boolean
  ) => MapPlace[];
  getPlaceGeoJson: (place: MapPlace) => Promise<FeatureCollection>;
  calculateMapBounds: (place: MapPlace) => {
    center: LatLngTuple;
    zoom: number;
  };
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
  const [visiblePlacesInView, setVisiblePlacesInView] = useState<MapPlace[]>([]);
  const [numPrioritizedToShow, setNumPrioritizedToShow] = useState<number>(15);
  const [filters, setFilters] = useState<{
    activeTypes: CitiesTypeOptions[];
    populationCategory: boolean;
  }>({
    activeTypes: Object.values(CitiesTypeOptions),
    populationCategory: false,
  });

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
        return [
          CitiesTypeOptions.country,
          CitiesTypeOptions.region,
          CitiesTypeOptions.city,
        ];
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

  const calculatePlaceScore = useCallback((place: MapPlace): number => {
    let score = 0;

    // Factor 1: Rating (0-5 points)
    const rating =
      typeof place.averageRating === "number" ? place.averageRating : 0;
    score += rating;

    // Factor 2: Place type importance (0-3 points)
    switch (place.type) {
      case CitiesTypeOptions.country:
        score += state.zoom <= ZOOM_LEVELS.COUNTRY ? 3 : 1;
        break;
      case CitiesTypeOptions.region:
        score +=
          state.zoom > ZOOM_LEVELS.COUNTRY && state.zoom <= ZOOM_LEVELS.REGION
            ? 3
            : 1;
        break;
      case CitiesTypeOptions.city:
        score +=
          state.zoom > ZOOM_LEVELS.REGION && state.zoom <= ZOOM_LEVELS.CITY
            ? 3
            : 1;
        break;
      case CitiesTypeOptions.neighborhood:
        score += state.zoom > ZOOM_LEVELS.CITY ? 3 : 0;
        break;
      case CitiesTypeOptions.sight:
        score += state.zoom > ZOOM_LEVELS.NEIGHBORHOOD ? 3 : 0;
        break;
    }

    // Factor 3: Population size for cities (0-2 points)
    if (place.type === CitiesTypeOptions.city && place.population) {
      const population = parseInt(place.population as string, 10);
      if (!isNaN(population)) {
        if (population >= 1000000) score += 2;
        else if (population >= 100000) score += 1;
      }
    }

    return score;
  }, [state.zoom]);

  useEffect(() => {
    if (!mapBounds || !visiblePlaces.length) return;

    // First filter by bounds
    const inBoundsPlaces = visiblePlaces.filter((place) => {
      if (!place.latitude || !place.longitude) return false;
      return mapBounds.contains([place.latitude, place.longitude]);
    });

    // Then score and sort
    const scoredPlaces = inBoundsPlaces
      .map((place) => ({
        ...place,
        score: calculatePlaceScore(place),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...place }) => place);

    setVisiblePlacesInView(scoredPlaces);
  }, [mapBounds, visiblePlaces, calculatePlaceScore]);

  const getVisiblePlacesForCurrentView = useCallback(
    (allPlaces: MapPlace[]): MapPlace[] => {
      if (!mapBounds) return allPlaces;

      // Filter by current zoom level and bounds
      return filterPlacesByZoom(allPlaces, state.zoom, filters.populationCategory)
        .filter((place) => {
          if (!place.latitude || !place.longitude) return false;
          return mapBounds.contains([place.latitude, place.longitude]);
        })
        .filter((place) => filters.activeTypes.includes(place.type as any));
    },
    [state.zoom, mapBounds, filters]
  );

  const prioritizedPlaces = useMemo(() => {
    if (!visiblePlacesInView) return [];
    return visiblePlacesInView.slice(0, numPrioritizedToShow);
  }, [visiblePlacesInView, numPrioritizedToShow]);

  const value = useMemo(() => ({
    ...state,
    setZoom,
    setCenter,
    selectPlace,
    resetView,
    mapBounds,
    setMapBounds,
    visiblePlaces,
    setVisiblePlaces,
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    prioritizedPlaces,
    getVisiblePlacesForCurrentView,
    getVisiblePlaceTypes,
    filterPlacesByZoom,
    getPlaceGeoJson,
    calculateMapBounds,
    getGeographicLevel,
  }), [
    state,
    mapBounds,
    visiblePlaces,
    visiblePlacesInView,
    numPrioritizedToShow,
    prioritizedPlaces,
    getVisiblePlacesForCurrentView,
  ]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
