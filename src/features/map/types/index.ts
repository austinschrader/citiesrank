// src/features/map/types/index.ts
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { LatLngTuple } from "leaflet";

// Core map types
export interface MapPlace extends CitiesResponse {
  type: CitiesTypeOptions;
}

export interface MapViewState {
  zoom: number;
  center: LatLngTuple;
  geographicLevel: CitiesTypeOptions;
}

export interface MapBounds {
  center: LatLngTuple;
  zoom: number;
}

// Component prop types
export interface MapMarkerProps {
  place: MapPlace;
  onSelect?: (place: MapPlace) => void;
  isSelected?: boolean;
}

export interface CityMapProps {
  places: MapPlace[];
  onPlaceSelect?: (place: MapPlace) => void;
  className?: string;
}

export interface MapControlsProps {
  onZoomChange: (zoom: number) => void;
  defaultCenter?: LatLngTuple;
  defaultZoom?: number;
}

export interface PlaceGeoJsonProps {
  place: MapPlace;
}

// Style configuration types
export interface MarkerStyle {
  color: string;
  size: number;
  className?: string;
}

export interface GeoJsonStyle {
  weight: number;
  opacity: number;
  color: string;
  fillOpacity: number;
}

// Map state types
export interface MapStateContext {
  mapState: MapViewState;
  setZoom: (zoom: number) => void;
  setCenter: (center: LatLngTuple) => void;
  resetView: () => void;
}

export interface MapUpdaterProps {
  selectedPlace: MapPlace | null;
  shouldReset: boolean;
  defaultCenter: LatLngTuple;
  defaultZoom: number;
}
