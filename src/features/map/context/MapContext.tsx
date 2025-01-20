/**
 * Manages map state and content visibility:
 * - Determines what's visible based on mode (list/map/split)
 * - Handles map-specific filtering (zoom, bounds)
 * - Manages pagination and infinite scroll
 * - Unifies display logic for places/lists
 *
 * Dependencies: Requires HeaderProvider, FiltersContext
 * Consumers: SplitExplorer, Map components, Panel components
 */

import { useLists } from "@/features/lists/context/ListsContext";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { pb } from "@/lib/pocketbase";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { FeatureCollection } from "geojson";
import L, { LatLngBounds, LatLngTuple } from "leaflet";
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
import {
  ZOOM_LEVELS,
  filterPlacesByBounds,
  filterPlacesByType,
  filterPlacesByZoom,
} from "../utils/placeFiltering";

export type SplitMode = "list" | "split" | "map";

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
const DEFAULT_CENTER: LatLngTuple = [46.2276, 2.2137]; // Paris
const DEFAULT_ZOOM = 6;

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
  mapBounds: LatLngBounds | null;
  setMapBounds: (bounds: LatLngBounds | null) => void;
  visiblePlaces: MapPlace[];
  setVisiblePlaces: (places: MapPlace[]) => void;
  visiblePlacesInView: MapPlace[];
  numPrioritizedToShow: number;
  setNumPrioritizedToShow: React.Dispatch<React.SetStateAction<number>>;
  prioritizedPlaces: MapPlace[];
  maxItems: number;
  hasMore: () => boolean;
  loadMore: () => void;
  getVisiblePlacesForCurrentView: (allPlaces: MapPlace[]) => MapPlace[];
  getVisiblePlaceTypes: (zoom: number) => CitiesTypeOptions[];
  filterPlacesByZoom: (places: MapPlace[], zoom: number) => MapPlace[];
  getPlaceGeoJson: (place: MapPlace) => Promise<FeatureCollection>;
  calculateMapBounds: (place: MapPlace) => {
    center: LatLngTuple;
    zoom: number;
  };
  getGeographicLevel: (zoom: number) => CitiesTypeOptions;
  splitMode: SplitMode;
  setSplitMode: (mode: SplitMode) => void;
  visibleLists: any[];
  getDisplayPlaces: (paginatedFilteredPlaces: MapPlace[]) => MapPlace[];
  isLoadingMore: boolean;
  filteredPlaces: MapPlace[];
  paginatedFilteredPlaces: MapPlace[];
}

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const { filters, getFilteredCities } = useFilters();
  const { getList } = useLists();
  const { cities } = useCities();

  const [state, setState] = useState<MapState>({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    geographicLevel: CitiesTypeOptions.country,
    selectedPlace: null,
  });

  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [visiblePlaces, setVisiblePlaces] = useState<MapPlace[]>([]);
  const [visiblePlacesInView, setVisiblePlacesInView] = useState<MapPlace[]>(
    []
  );
  const [prioritizedPlaces, setPrioritizedPlaces] = useState<MapPlace[]>([]);
  const [numPrioritizedToShow, setNumPrioritizedToShow] = useState(
    window.innerWidth <= 640 ? DEFAULT_MOBILE_PLACES : DEFAULT_DESKTOP_PLACES
  );
  const [splitMode, setSplitMode] = useState<SplitMode>("split");
  const [visibleLists, setVisibleLists] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const BATCH_SIZE = 25; // Fixed size for infinite scroll

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

  const filterPlacesByBoundsCallback = useCallback(
    (places: MapPlace[]): MapPlace[] => {
      return filterPlacesByBounds(places, mapBounds);
    },
    [mapBounds]
  );

  const filterPlacesByTypeCallback = useCallback(
    (places: MapPlace[]): MapPlace[] => {
      return filterPlacesByType(places, filters.activeTypes);
    },
    [filters.activeTypes]
  );

  const filterPlacesByZoomCallback = useCallback(
    (places: MapPlace[]): MapPlace[] => {
      return filterPlacesByZoom(places, state.zoom, null);
    },
    [state.zoom]
  );

  const getVisiblePlacesForCurrentView = useCallback(
    (allPlaces: MapPlace[]): MapPlace[] => {
      if (state.zoom > 12) {
        return filterPlacesByBoundsCallback(allPlaces);
      }

      const boundsFiltered = filterPlacesByBoundsCallback(allPlaces);
      const typeFiltered = filterPlacesByTypeCallback(boundsFiltered);
      return filterPlacesByZoomCallback(typeFiltered);
    },
    [
      state.zoom,
      filterPlacesByBoundsCallback,
      filterPlacesByTypeCallback,
      filterPlacesByZoomCallback,
    ]
  );

  useEffect(() => {
    const newVisiblePlaces = getVisiblePlacesForCurrentView(visiblePlaces);
    setVisiblePlacesInView(newVisiblePlaces);
    setPrioritizedPlaces(newVisiblePlaces.slice(0, numPrioritizedToShow));
  }, [
    getVisiblePlacesForCurrentView,
    visiblePlaces,
    state.zoom,
    mapBounds,
    filters,
    numPrioritizedToShow,
  ]);

  useEffect(() => {
    if (!mapBounds) return;

    const bounds = {
      south: Number(mapBounds.getSouth().toFixed(4)),
      north: Number(mapBounds.getNorth().toFixed(4)),
      west: Number(mapBounds.getWest().toFixed(4)),
      east: Number(mapBounds.getEast().toFixed(4)),
    };

    const filter = `center_lat >= ${bounds.south} && center_lat <= ${bounds.north} && center_lng >= ${bounds.west} && center_lng <= ${bounds.east}`;

    pb.collection("list_locations")
      .getFullList({
        filter,
        expand: "list",
        $autoCancel: false,
      })
      .then(async (locations) => {
        // Get unique list IDs
        const listIds = [
          ...new Set(
            locations.map((loc) => loc.expand?.list?.id).filter(Boolean)
          ),
        ];

        // Get full list data for each list using ListsContext
        const lists = await Promise.all(listIds.map((id) => getList(id)));
        setVisibleLists(lists);
      })
      .catch((error) => {
        console.error("Error fetching visible lists:", error);
      });
  }, [mapBounds, getList]);

  const hasMore = useCallback(() => {
    const currentCount = numPrioritizedToShow;
    const maxItemCount =
      splitMode === "list" ? visiblePlaces.length : visiblePlacesInView.length;
    return currentCount < maxItemCount;
  }, [
    numPrioritizedToShow,
    splitMode,
    visiblePlaces.length,
    visiblePlacesInView.length,
  ]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      setNumPrioritizedToShow((prev) => prev + BATCH_SIZE);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, BATCH_SIZE]);

  const resetDistribution = useCallback(() => {
    setVisiblePlaces((prev) => [...prev]);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setSplitMode("map");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDisplayPlaces = useCallback(
    (paginatedFilteredPlaces: MapPlace[]) => {
      return splitMode === "list" ? paginatedFilteredPlaces : prioritizedPlaces;
    },
    [splitMode, prioritizedPlaces]
  );

  // Get filtered places using FiltersContext
  const filteredPlaces = useMemo(() => {
    return getFilteredCities(cities);
  }, [cities, getFilteredCities]);

  // Update visible places when filtered places change
  useEffect(() => {
    if (cities.length > 0) {
      setVisiblePlaces(filteredPlaces);
    }
  }, [cities, filteredPlaces]);

  // Get paginated filtered places
  const paginatedFilteredPlaces = useMemo(() => {
    return filteredPlaces.slice(0, numPrioritizedToShow);
  }, [filteredPlaces, numPrioritizedToShow]);

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
      visiblePlaces: filteredPlaces,
      setVisiblePlaces,
      visiblePlacesInView,
      numPrioritizedToShow,
      setNumPrioritizedToShow,
      prioritizedPlaces,
      maxItems:
        splitMode === "list"
          ? filteredPlaces.length
          : visiblePlacesInView.length,
      hasMore,
      getVisiblePlacesForCurrentView,
      getVisiblePlaceTypes,
      filterPlacesByZoom: filterPlacesByZoomCallback,
      getPlaceGeoJson,
      calculateMapBounds,
      getGeographicLevel,
      splitMode,
      setSplitMode,
      loadMore,
      visibleLists,
      getDisplayPlaces,
      isLoadingMore,
      filteredPlaces,
      paginatedFilteredPlaces,
    }),
    [
      state,
      mapBounds,
      filteredPlaces,
      visiblePlacesInView,
      numPrioritizedToShow,
      prioritizedPlaces,
      hasMore,
      getVisiblePlacesForCurrentView,
      loadMore,
      splitMode,
      visibleLists,
      getDisplayPlaces,
      isLoadingMore,
      paginatedFilteredPlaces,
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
