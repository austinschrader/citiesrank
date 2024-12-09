import { MapPlace } from "../types";
import { GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Layer } from "leaflet";

interface PlaceGeoJsonProps {
  place: MapPlace;
}

const getStyleForType = (type?: CitiesTypeOptions) => {
  const baseStyle = {
    weight: 2,
    opacity: 0.65,
    fillOpacity: 0.2,
  };

  switch (type) {
    case 'country':
      return {
        ...baseStyle,
        color: "#ef4444", // red
        fillOpacity: 0.1,
      };
    case 'region':
      return {
        ...baseStyle,
        color: "#f59e0b", // amber
        fillOpacity: 0.15,
      };
    case 'city':
      return {
        ...baseStyle,
        color: "#3b82f6", // blue
        fillOpacity: 0.2,
      };
    case 'neighborhood':
      return {
        ...baseStyle,
        color: "#10b981", // emerald
        fillOpacity: 0.25,
      };
    case 'sight':
      return {
        ...baseStyle,
        color: "#8b5cf6", // violet
        fillOpacity: 0.3,
      };
    default:
      return {
        ...baseStyle,
        color: "#3b82f6", // blue
      };
  }
};

export const PlaceGeoJson = ({ place }: PlaceGeoJsonProps) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const map = useMap();

  // Cleanup function to remove layers
  const cleanupLayers = useCallback(() => {
    map.eachLayer((layer: Layer) => {
      if ((layer as any).feature) {
        map.removeLayer(layer);
      }
    });
  }, [map]);

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        cleanupLayers(); // Clean up existing layers
        const data = await getPlaceGeoJson(place);
        setGeoJsonData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    loadGeoJson();

    // Cleanup when component unmounts or place changes
    return () => {
      cleanupLayers();
    };
  }, [place, cleanupLayers]);

  if (!geoJsonData) return null;

  return (
    <GeoJSON 
      key={`${place.id}-${place.type}`} // More specific key
      data={geoJsonData}
      style={() => getStyleForType(place.type)}
    />
  );
};
