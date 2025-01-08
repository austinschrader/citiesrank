import { CitiesRecord, CitiesResponse } from "@/lib/types/pocketbase-types";

// Using CitiesResponse instead of CitiesRecord to include system fields like 'id'
export type MapPlace = CitiesResponse;

export interface MapState {
  zoom: number;
  center: [number, number];
  selectedPlace: MapPlace | null;
  visiblePlaces: MapPlace[];
  prioritizedPlaces: MapPlace[];
  numPrioritizedToShow: number;
  viewMode: 'map' | 'list';
}
