// file location: src/features/map/components/CityMap.tsx
/**
 * Main map component that renders interactive city locations with markers.
 * Handles map interactions, marker clicks, and location selection.
 * Uses MapContext for state management and Leaflet for map rendering.
 */

import { Button } from "@/components/ui/button";
import { useCities } from "@/features/places/context/CitiesContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap as useLeafletMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useMap } from "../context/MapContext";
import { MapControls } from "./MapControls";
import { MapLegend } from "./MapLegend";
import { MapMarker } from "./MapMarker";
import { PlaceGeoJson } from "./PlaceGeoJson";

const BoundsTracker = () => {
  const map = useLeafletMap();
  const { setMapBounds } = useMap();

  useEffect(() => {
    const handleMove = () => {
      const bounds = map.getBounds();
      setMapBounds(bounds);
    };

    map.on("moveend", handleMove);
    // Set initial bounds immediately
    requestAnimationFrame(() => {
      handleMove();
    });

    return () => {
      map.off("moveend", handleMove);
    };
  }, [map, setMapBounds]);

  return null;
};

export const CityMap = () => {
  const { center, zoom, selectedPlace, setZoom } = useMap();
  const { cities } = useCities();
  const { filters, getFilteredCities, resetFilters, hasActiveFilters } = useFilters();
  const {
    visiblePlacesInView,
    setVisiblePlaces,
  } = useMap();

  // Memoize filtered cities computation
  const filteredCities = useMemo(() => {
    return getFilteredCities(cities);
  }, [cities, getFilteredCities, filters.budget, filters.season]);

  // Update visible places with cleanup
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setVisiblePlaces(filteredCities);
    }

    return () => {
      isMounted = false;
    };
  }, [filteredCities, setVisiblePlaces]);

  // Memoize visible places for MarkerClusterGroup
  const memoizedVisiblePlaces = useMemo(
    () => visiblePlacesInView,
    [visiblePlacesInView]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full rounded-xl relative z-0"
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <BoundsTracker />
        <MapControls onZoomChange={setZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
        >
          {memoizedVisiblePlaces.map((place) => (
            <MapMarker key={place.id} place={place} />
          ))}
        </MarkerClusterGroup>
        {selectedPlace && <PlaceGeoJson place={selectedPlace} />}
      </MapContainer>

      {/* Status Indicator */}
      {hasActiveFilters() && visiblePlacesInView.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] hidden sm:block">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-background/95 backdrop-blur-sm shadow-lg border",
                "text-muted-foreground text-sm sm:text-base"
              )}
            >
              <span className="whitespace-nowrap">
                {visiblePlacesInView.length} places found
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="rounded-full bg-background/95 backdrop-blur-sm shadow-lg hover:bg-accent"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span>Clear filters</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
