/**
 * Global map state provider used by map components to share state and interactions.
 * Manages zoom, center, selected place and geographic level. Used by CityMap and
 * its child components via useMap hook.
 */

/**
 * MapContext manages all map-related state and operations.
 * It takes filtered places from FiltersContext and applies map-specific
 * filtering (bounds, zoom) and pagination.
 *
 * Responsibilities:
 * 1. Map State Management
 *    - Zoom level, center coordinates
 *    - Selected place
 *    - Map bounds
 *
 * 2. Map-Specific Place Filtering
 *    - Filter places by zoom level
 *    - Filter places by map bounds
 *    - Handle place pagination
 *
 * Does NOT handle:
 *  - Raw city data (handled by CitiesContext)
 *  - User-defined filters (handled by FiltersContext)
 *  - UI components or interactions
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

export type ViewMode = "list" | "split" | "map";

// Zoom level constants for place type visibility
export const ZOOM_LEVELS = {
  COUNTRY: 3,
  REGION: 5,
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
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

// OECD country centers with their coordinates and recommended zoom levels
const COUNTRY_CENTERS: Array<{
  name: string;
  center: LatLngTuple;
  zoom: number;
}> = [
  { name: "United States", center: [39.8283, -98.5795], zoom: 5 },
  { name: "Japan", center: [36.2048, 138.2529], zoom: 6 },
  { name: "France", center: [46.2276, 2.2137], zoom: 6 },
  { name: "Italy", center: [41.8719, 12.5674], zoom: 6 },
  { name: "United Kingdom", center: [55.3781, -3.436], zoom: 6 },
  { name: "Germany", center: [51.1657, 10.4515], zoom: 6 },
  { name: "Spain", center: [40.4637, -3.7492], zoom: 6 },
  { name: "Australia", center: [-25.2744, 133.7751], zoom: 5 },
  { name: "South Korea", center: [35.9078, 127.7669], zoom: 7 },
  { name: "Netherlands", center: [52.1326, 5.2913], zoom: 7 },
  { name: "Switzerland", center: [46.8182, 8.2275], zoom: 8 },
];

// Get random country center
const getRandomCenter = () => {
  const randomIndex = Math.floor(Math.random() * COUNTRY_CENTERS.length);
  return COUNTRY_CENTERS[randomIndex];
};

const randomCountry = getRandomCenter();
console.log(`🌍 Starting view centered on ${randomCountry.name}`);

const DEFAULT_CENTER = randomCountry.center;
const DEFAULT_ZOOM = randomCountry.zoom;
const DEFAULT_MOBILE_PLACES = 15;
const DEFAULT_DESKTOP_PLACES = 30;

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
  const [visiblePlacesInView, setVisiblePlacesInView] = useState<MapPlace[]>(
    []
  );
  const [numPrioritizedToShow, setNumPrioritizedToShow] = useState<number>(15);
  const [filters, setFilters] = useState<{
    activeTypes: CitiesTypeOptions[];
    populationCategory: boolean;
  }>({
    activeTypes: Object.values(CitiesTypeOptions),
    populationCategory: false,
  });

  // Set default view mode based on device type
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth >= 1024 ? "split" : "map";
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
    if (zoom <= ZOOM_LEVELS.COUNTRY) {
      // At country level, show countries and major cities
      return [CitiesTypeOptions.country, CitiesTypeOptions.city];
    } else if (zoom <= ZOOM_LEVELS.REGION) {
      // At region level, show countries, regions, and major cities
      return [CitiesTypeOptions.country, CitiesTypeOptions.region, CitiesTypeOptions.city];
    } else if (zoom <= ZOOM_LEVELS.CITY) {
      // At city level, show all except sights
      return [
        CitiesTypeOptions.country,
        CitiesTypeOptions.region,
        CitiesTypeOptions.city,
        CitiesTypeOptions.neighborhood
      ];
    } else if (zoom <= ZOOM_LEVELS.NEIGHBORHOOD) {
      // At neighborhood level, show everything
      return Object.values(CitiesTypeOptions);
    }
    return Object.values(CitiesTypeOptions);
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
      
      // Always include major cities regardless of zoom level
      if (place.type === CitiesTypeOptions.city && place.population) {
        const population = parseInt(place.population as string, 10);
        if (!isNaN(population) && population >= 1000000) {
          return true;
        }
      }
      
      return visibleTypes.includes(place.type as CitiesTypeOptions);
    });
  };

  const calculatePlaceScore = useCallback(
    (place: MapPlace): number => {
      let score = 0;

      // Factor 1: Rating (0-5 points)
      const rating = typeof place.averageRating === "number" ? place.averageRating : 0;
      score += rating;

      // Factor 2: Place type importance with zoom-based tapering (0-15 points)
      const zoomLevel = state.zoom;
      switch (place.type) {
        case CitiesTypeOptions.country:
          // Countries dominate at low zoom
          score += Math.max(0, 15 - Math.max(0, zoomLevel - ZOOM_LEVELS.COUNTRY) * 2);
          break;
        case CitiesTypeOptions.region:
          // Regions peak near their zoom level
          if (zoomLevel <= ZOOM_LEVELS.COUNTRY) {
            score += 5; // Moderate visibility at country level
          } else if (zoomLevel <= ZOOM_LEVELS.REGION) {
            score += 12; // High visibility at region level
          } else {
            score += Math.max(0, 10 - Math.max(0, zoomLevel - ZOOM_LEVELS.REGION) * 1.5);
          }
          break;
        case CitiesTypeOptions.city:
          // Cities increase in importance as you zoom in
          if (zoomLevel <= ZOOM_LEVELS.COUNTRY) {
            score += 3; // Low visibility at country level
          } else if (zoomLevel <= ZOOM_LEVELS.REGION) {
            score += 6; // Medium visibility at region level
          } else if (zoomLevel <= ZOOM_LEVELS.CITY) {
            score += 10; // High visibility at city level
          } else {
            score += 8; // Good visibility at high zooms
          }
          break;
        case CitiesTypeOptions.neighborhood:
          if (zoomLevel > ZOOM_LEVELS.CITY) {
            score += Math.min(8, (zoomLevel - ZOOM_LEVELS.CITY) * 1.5);
          }
          break;
        case CitiesTypeOptions.sight:
          if (zoomLevel > ZOOM_LEVELS.NEIGHBORHOOD) {
            score += Math.min(7, (zoomLevel - ZOOM_LEVELS.NEIGHBORHOOD) * 2);
          }
          break;
      }

      // Factor 3: Population size bonus (0-5 points for cities)
      if (place.type === CitiesTypeOptions.city && place.population) {
        const population = parseInt(place.population as string, 10);
        if (!isNaN(population)) {
          if (population >= 5000000) score += 5;
          else if (population >= 1000000) score += 4;
          else if (population >= 500000) score += 2;
        }
      }

      return score;
    },
    [state.zoom]
  );

  useEffect(() => {
    if (mapBounds && visiblePlaces.length > 0) {
      const placesInView = getVisiblePlacesForCurrentView(visiblePlaces);
      setVisiblePlacesInView(placesInView);
    }
  }, [mapBounds, visiblePlaces]);

  useEffect(() => {
    if (viewMode === "map") {
      setNumPrioritizedToShow(15);
    }
  }, [viewMode]);

  const getVisiblePlacesForCurrentView = useCallback(
    (allPlaces: MapPlace[]): MapPlace[] => {
      if (!mapBounds) return allPlaces;

      // Filter by current zoom level and bounds
      const filteredPlaces = filterPlacesByZoom(
        allPlaces,
        state.zoom,
        filters.populationCategory
      )
        .filter((place) => {
          if (!place.latitude || !place.longitude) return false;
          return mapBounds.contains([place.latitude, place.longitude]);
        })
        .filter((place) => filters.activeTypes.includes(place.type as any));

      // Sort places by their scores
      return filteredPlaces.sort((a, b) => {
        const scoreA = calculatePlaceScore(a);
        const scoreB = calculatePlaceScore(b);
        return scoreB - scoreA; // Higher scores first
      });
    },
    [state.zoom, mapBounds, filters, calculatePlaceScore]
  );

  const prioritizedPlaces = useMemo(() => {
    if (!visiblePlacesInView) return [];
    return visiblePlacesInView.slice(0, numPrioritizedToShow);
  }, [visiblePlacesInView, numPrioritizedToShow]);

  const value = useMemo(
    () => ({
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
      viewMode,
      setViewMode,
    }),
    [
      state,
      mapBounds,
      visiblePlaces,
      visiblePlacesInView,
      numPrioritizedToShow,
      prioritizedPlaces,
      getVisiblePlacesForCurrentView,
      viewMode,
    ]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
