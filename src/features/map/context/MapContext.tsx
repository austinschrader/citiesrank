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
import { LatLngBounds, LatLngTuple } from "leaflet";
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
  const { cities, sortedCities } = useCities();
  const { getList } = useLists();

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
  const [splitMode, setSplitMode] = useState<SplitMode>(
    window.innerWidth <= 768 ? "map" : "split"
  );
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
      // Skip filtering if no bounds or unreasonably small bounds
      if (
        !mapBounds ||
        mapBounds.getEast() - mapBounds.getWest() < 1 || // Less than 1 degree wide
        mapBounds.getNorth() - mapBounds.getSouth() < 1 // Less than 1 degree tall
      ) {
        return allPlaces;
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
      setNumPrioritizedToShow(
        window.innerWidth <= 640
          ? DEFAULT_MOBILE_PLACES
          : DEFAULT_DESKTOP_PLACES
      );
      setSplitMode(window.innerWidth <= 768 ? "map" : "split");
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
    // Use sortedCities if available, otherwise use regular cities
    const sourceCities = sortedCities || cities;
    return getFilteredCities(sourceCities);
  }, [cities, sortedCities, getFilteredCities]);

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
