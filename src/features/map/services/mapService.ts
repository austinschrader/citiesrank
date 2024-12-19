// file location: src/features/map/services/mapService.ts
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { LatLngTuple } from "leaflet";
import { MapPlace } from "../types";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";
import { calculateMapBounds } from "../utils/mapUtils";
import { ZOOM_LEVELS } from "../context/MapContext";

export class MapService {
  private static instance: MapService;

  private constructor() {}

  static getInstance(): MapService {
    if (!this.instance) {
      this.instance = new MapService();
    }
    return this.instance;
  }

  async getPlaceGeoJson(place: MapPlace) {
    return getPlaceGeoJson(place);
  }

  calculateBounds(place: MapPlace): {
    center: LatLngTuple;
    zoom: number;
  } {
    return calculateMapBounds(place);
  }

  getGeographicLevel(zoom: number): CitiesTypeOptions {
    if (zoom <= ZOOM_LEVELS.COUNTRY) return CitiesTypeOptions.country;
    if (zoom <= ZOOM_LEVELS.REGION) return CitiesTypeOptions.region;
    if (zoom <= ZOOM_LEVELS.CITY) return CitiesTypeOptions.city;
    if (zoom <= ZOOM_LEVELS.NEIGHBORHOOD) return CitiesTypeOptions.neighborhood;
    return CitiesTypeOptions.sight;
  }
}

export const mapService = MapService.getInstance();
