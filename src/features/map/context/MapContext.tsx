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
import { debounce } from "lodash";
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

const DEFAULT_MOBILE_PLACES = 15;
const DEFAULT_DESKTOP_PLACES = 15;

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
  { name: "Canada", center: [56.1304, -106.3468], zoom: 4 },
  { name: "New Zealand", center: [-40.9006, 174.886], zoom: 6 },
  { name: "Netherlands", center: [52.1326, 5.2913], zoom: 7 },
  { name: "Switzerland", center: [46.8182, 8.2275], zoom: 8 },
  { name: "Sweden", center: [60.1282, 18.6435], zoom: 5 },
  { name: "Norway", center: [60.472, 8.4689], zoom: 5 },
];

// Get random country center
const getRandomCenter = () => {
  const randomIndex = Math.floor(Math.random() * COUNTRY_CENTERS.length);
  return COUNTRY_CENTERS[randomIndex];
};

const randomCountry = getRandomCenter();
console.log(`🌍 Starting view centered on ${randomCountry.name}`);
// const DEFAULT_CENTER = randomCountry.center;
// const DEFAULT_ZOOM = randomCountry.zoom;

const DEFAULT_CENTER: LatLngTuple = [45.5152, -122.6784]; // Portland, OR
const DEFAULT_ZOOM = 9;

// Zoom level constants for place type visibility
export const ZOOM_LEVELS = {
  COUNTRY: 5,
  REGION: 6,
  CITY: 8,
  NEIGHBORHOOD: 12,
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
  resetDistribution: () => void;
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
  hasMorePlaces: boolean;
  loadMorePlaces: () => void;
}

// Simple hash function for consistent randomness
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
};

const getRandomForPlace = (place: MapPlace): number => {
  // Use coordinates and ID for consistent randomness
  const seed = `${place.id}-${place.latitude}-${place.longitude}`;
  return hashString(seed);
};

const MapContext = createContext<MapContextValue | null>(null);

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
  const [numPrioritizedToShow, setNumPrioritizedToShow] = useState<number>(
    window.innerWidth <= 640 ? DEFAULT_MOBILE_PLACES : DEFAULT_DESKTOP_PLACES
  );
  const [hasMorePlaces, setHasMorePlaces] = useState(true);
  const [currentlyShownCount, setCurrentlyShownCount] = useState(0);

  const [filters, setFilters] = useState<{
    activeTypes: CitiesTypeOptions[];
    populationCategory: boolean;
  }>({
    // Start with a mix of different place types for more variety
    activeTypes: [
      CitiesTypeOptions.city,
      CitiesTypeOptions.region,
      CitiesTypeOptions.country,
    ],
    populationCategory: false,
  });

  const [viewMode, setViewMode] = useState<ViewMode>(
    window.innerWidth <= 640 ? "map" : "split"
  );

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
    // At any zoom level, allow a mix of places
    // But adjust probabilities through scoring instead of filtering
    return Object.values(CitiesTypeOptions);
  };

  const filterPlacesByZoom = useCallback(
    (
      places: MapPlace[],
      zoom: number,
      populationCategoryActive = false
    ): MapPlace[] => {
      if (populationCategoryActive) {
        return places.filter((place) => place.type === CitiesTypeOptions.city);
      }

      return places.filter((place) => {
        if (!place.type || !place.id) return false;

        // Determine visibility threshold based on place type and zoom
        const getVisibilityThreshold = () => {
          const baseThreshold = Math.min(
            1,
            Math.max(0.1, (zoom / ZOOM_LEVELS.CITY) * 0.8)
          );

          if (place.type === CitiesTypeOptions.country) {
            // Always show countries at low zoom, higher chance at high zoom
            return zoom <= ZOOM_LEVELS.COUNTRY ? 1 : baseThreshold * 2;
          }

          if (place.type === CitiesTypeOptions.region) {
            // Increased threshold for regions
            return zoom > ZOOM_LEVELS.REGION ? 1 : baseThreshold * 1.5;
          }

          if (place.type === CitiesTypeOptions.city) {
            const population = parseInt(place.population as string, 10);
            if (!isNaN(population)) {
              if (population >= 1000000) return 1; // Always show major cities
              if (population >= 500000) return baseThreshold * 1.5;
              return baseThreshold;
            }
          }

          if (
            place.type === CitiesTypeOptions.sight ||
            place.type === CitiesTypeOptions.neighborhood
          ) {
            return zoom > ZOOM_LEVELS.COUNTRY ? 0.9 : baseThreshold * 0.5;
          }

          return baseThreshold;
        };

        const threshold = getVisibilityThreshold();
        return getRandomForPlace(place) < threshold;
      });
    },
    [] // No dependencies since it's a pure function
  );

  const filterPlacesByBounds = useCallback(
    (places: MapPlace[]): MapPlace[] => {
      if (!mapBounds) return places;
      return places.filter((place) => {
        if (!place.latitude || !place.longitude) return false;
        return mapBounds.contains([place.latitude, place.longitude]);
      });
    },
    [mapBounds]
  );

  const filterPlacesByType = useCallback(
    (places: MapPlace[]): MapPlace[] => {
      return places.filter((place) =>
        filters.activeTypes.includes(place.type as any)
      );
    },
    [filters.activeTypes]
  );

  const getVisiblePlacesForCurrentView = useCallback(
    (allPlaces: MapPlace[]): MapPlace[] => {
      const boundsFiltered = filterPlacesByBounds(allPlaces);
      const typeFiltered = filterPlacesByType(boundsFiltered);
      return filterPlacesByZoom(
        typeFiltered,
        state.zoom,
        filters.populationCategory
      );
    },
    [
      filterPlacesByBounds,
      filterPlacesByType,
      filterPlacesByZoom,
      state.zoom,
      filters.populationCategory,
    ]
  );

  const calculatePlaceScore = useCallback(
    (place: MapPlace): number => {
      let score = 0;

      // Base random boost (0-8 points) - now consistent for each place
      const baseRandomBoost = getRandomForPlace(place) * 8;
      score += baseRandomBoost;

      // Rating boost (0-7 points)
      const rating =
        typeof place.averageRating === "number" ? place.averageRating : 0;
      score +=
        rating *
        (getRandomForPlace({ ...place, id: place.id + "-rating" }) * 1.4);

      // Type-specific scoring with zoom consideration
      switch (place.type) {
        case CitiesTypeOptions.country:
          // Increased score for countries
          score += state.zoom <= ZOOM_LEVELS.COUNTRY ? 12 : 4;
          // Additional bonus for countries
          if (
            getRandomForPlace({ ...place, id: place.id + "-country-bonus" }) <
            0.5
          ) {
            score += 6;
          }
          break;
        case CitiesTypeOptions.region:
          // Increased score for regions
          score += state.zoom <= ZOOM_LEVELS.REGION ? 10 : 4;
          // Additional bonus for regions
          if (
            getRandomForPlace({ ...place, id: place.id + "-region-bonus" }) <
            0.4
          ) {
            score += 5;
          }
          break;
        case CitiesTypeOptions.city: {
          const population = parseInt(place.population as string, 10) || 0;
          // Give cities a better chance at low zoom
          const cityScore = state.zoom <= ZOOM_LEVELS.CITY ? 7 : 2;
          score += cityScore;

          // Population bonus
          if (population >= 1000000) score += 6;
          else if (population >= 500000) score += 4;
          break;
        }
        case CitiesTypeOptions.neighborhood:
        case CitiesTypeOptions.sight:
          // Give interesting places a chance even at low zoom
          if (state.zoom <= ZOOM_LEVELS.COUNTRY) {
            score +=
              getRandomForPlace({ ...place, id: place.id + "-zoom" }) < 0.2
                ? 10
                : 2;
          } else {
            score += state.zoom > ZOOM_LEVELS.CITY ? 8 : 4;
          }
          break;
      }

      // Chaos boost (0-10 points) - now consistent for each place
      const chaosBoost =
        getRandomForPlace({ ...place, id: place.id + "-chaos" }) * 10;
      score += chaosBoost;

      // Super boost (30% chance, 8-12 points) - now consistent for each place
      if (getRandomForPlace({ ...place, id: place.id + "-super" }) < 0.3) {
        score +=
          8 +
          getRandomForPlace({ ...place, id: place.id + "-super-value" }) * 4;
      }

      // Mega boost (5% chance, 15 points) - now consistent for each place
      if (getRandomForPlace({ ...place, id: place.id + "-mega" }) < 0.05) {
        score += 15;
      }

      return score;
    },
    [state.zoom]
  );

  const prioritizedPlaces = useMemo(() => {
    if (!visiblePlacesInView.length) return [];

    const sortedPlaces = [...visiblePlacesInView].sort((a, b) => {
      const scoreA = calculatePlaceScore(a);
      const scoreB = calculatePlaceScore(b);
      return scoreB - scoreA;
    });

    // Always show at least the minimum number of places
    const minPlaces =
      window.innerWidth <= 640 ? DEFAULT_MOBILE_PLACES : DEFAULT_DESKTOP_PLACES;
    const placesToShow = Math.max(minPlaces, numPrioritizedToShow);

    const places = sortedPlaces.slice(0, placesToShow);
    setCurrentlyShownCount(places.length);
    return places;
  }, [visiblePlacesInView, numPrioritizedToShow, calculatePlaceScore]);

  // Debounced update function to handle all state changes together
  const debouncedUpdateVisiblePlaces = useCallback(
    debounce((places: MapPlace[]) => {
      if (!mapBounds || !places.length) {
        setVisiblePlacesInView([]);
        setHasMorePlaces(false);
        return;
      }

      const newVisiblePlaces = getVisiblePlacesForCurrentView(places);
      setVisiblePlacesInView(newVisiblePlaces);
      setHasMorePlaces(newVisiblePlaces.length > numPrioritizedToShow);
    }, 300),
    [mapBounds, getVisiblePlacesForCurrentView, numPrioritizedToShow]
  );

  // Memoize the update function to prevent recreation
  const updateVisiblePlaces = useCallback(
    (places: MapPlace[]) => {
      debouncedUpdateVisiblePlaces(places);
    },
    [debouncedUpdateVisiblePlaces]
  );

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateVisiblePlaces.cancel();
    };
  }, [debouncedUpdateVisiblePlaces]);

  // Update visible places when relevant state changes
  useEffect(() => {
    updateVisiblePlaces(visiblePlaces);
  }, [visiblePlaces, updateVisiblePlaces]);

  const loadMorePlaces = useCallback(() => {
    setNumPrioritizedToShow((prev) => {
      const increment =
        window.innerWidth <= 640
          ? DEFAULT_MOBILE_PLACES
          : DEFAULT_DESKTOP_PLACES;
      return prev + increment;
    });
  }, []);

  const resetDistribution = useCallback(() => {
    // Force a re-render of the filtered places
    setVisiblePlaces((prev) => [...prev]);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setZoom,
      setCenter,
      selectPlace,
      resetView,
      resetDistribution,
      mapBounds,
      setMapBounds,
      visiblePlaces,
      setVisiblePlaces,
      visiblePlacesInView,
      numPrioritizedToShow,
      setNumPrioritizedToShow,
      prioritizedPlaces,
      hasMorePlaces,
      loadMorePlaces,
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
      hasMorePlaces,
      getVisiblePlacesForCurrentView,
      viewMode,
      loadMorePlaces,
    ]
  );

  useEffect(() => {
    const handleResize = () => {
      // Update number of places based on screen size
      setNumPrioritizedToShow(
        window.innerWidth <= 640
          ? DEFAULT_MOBILE_PLACES
          : DEFAULT_DESKTOP_PLACES
      );

      // Update view mode based on screen size
      // Only change to map view if screen becomes too small
      if (window.innerWidth <= 640) {
        setViewMode("map");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
