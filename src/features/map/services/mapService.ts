// file location: src/features/map/services/mapService.ts
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { LatLngTuple } from "leaflet";
import { MapPlace } from "../types";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";
import { calculateMapBounds } from "../utils/mapUtils";

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
    if (zoom <= 3) return CitiesTypeOptions.country;
    if (zoom <= 6) return CitiesTypeOptions.region;
    if (zoom <= 10) return CitiesTypeOptions.city;
    if (zoom <= 14) return CitiesTypeOptions.neighborhood;
    return CitiesTypeOptions.sight;
  }
}

export const mapService = MapService.getInstance();
