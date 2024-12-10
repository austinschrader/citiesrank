// src/features/map/components/PlaceGeoJson.tsx
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { Layer } from "leaflet";
import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { MapPlace } from "../types";
import { getPlaceGeoJson } from "../utils/geoJsonUtils";

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
    case CitiesTypeOptions.country:
      return {
        ...baseStyle,
        color: "#ef4444", // red
        fillOpacity: 0.1,
      };
    case CitiesTypeOptions.region:
      return {
        ...baseStyle,
        color: "#f59e0b", // amber
        fillOpacity: 0.15,
      };
    case CitiesTypeOptions.city:
      return {
        ...baseStyle,
        color: "#3b82f6", // blue
        fillOpacity: 0.2,
      };
    case CitiesTypeOptions.neighborhood:
      return {
        ...baseStyle,
        color: "#10b981", // emerald
        fillOpacity: 0.25,
      };
    case CitiesTypeOptions.sight:
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

  // Function to remove all GeoJSON layers
  const cleanupLayers = () => {
    map.eachLayer((layer: Layer) => {
      if ((layer as any).feature) {
        map.removeLayer(layer);
      }
    });
  };

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        cleanupLayers(); // Clean up existing layers first
        const data = await getPlaceGeoJson(place);
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    loadGeoJson();

    // Cleanup when component unmounts or place changes
    return () => {
      cleanupLayers();
      setGeoJsonData(null);
    };
  }, [place.id]); // Only reload when place.id changes

  if (!geoJsonData) return null;

  return (
    <GeoJSON
      key={`${place.id}-${place.type}`}
      data={geoJsonData}
      style={() => getStyleForType(place.type)}
      eventHandlers={{
        remove: cleanupLayers, // Add cleanup on layer removal
      }}
    />
  );
};
