import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { MapPlace } from "../types";
import { LatLngTuple } from "leaflet";

export function getZoomForPlaceType(type?: CitiesTypeOptions): number {
  switch (type) {
    case 'sight':
      return 17; // Very close zoom for sights
    case 'neighborhood':
      return 15; // Close zoom for neighborhoods
    case 'city':
      return 12; // City level zoom
    case 'region':
      return 7; // Region/state level zoom
    case 'country':
      return 5; // Country level zoom
    default:
      return 12; // Default to city zoom level
  }
}

export function calculateMapBounds(place: MapPlace): {
  center: LatLngTuple;
  zoom: number;
} {
  const zoom = getZoomForPlaceType(place.type);
  const center: LatLngTuple = [
    place.latitude || 0,
    place.longitude || 0
  ];

  return { center, zoom };
}
