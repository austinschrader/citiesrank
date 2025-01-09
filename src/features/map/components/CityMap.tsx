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
import { Filter, Loader2, Plus } from "lucide-react";
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

const pageSizeOptions = [15, 25, 50, 100];

interface CityMapProps {
  className?: string;
}

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

export const CityMap = ({ className }: CityMapProps) => {
  const { center, zoom, selectedPlace, setZoom } = useMap();
  const { cities } = useCities();
  const { filters, getFilteredCities, resetFilters } = useFilters();
  const {
    visiblePlacesInView,
    numPrioritizedToShow,
    setNumPrioritizedToShow,
    viewMode,
    setVisiblePlaces,
  } = useMap();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [itemsPerPage] = useState(pageSizeOptions[0]);

  // Memoize filtered cities computation
  const filteredCities = useMemo(() => {
    return getFilteredCities(cities, (city) => ({
      matchScore: 1,
      attributeMatches: {
        budget: filters.budget ? 1 : 0,
        crowds: 1,
        tripLength: 1,
        season: filters.season ? 1 : 0,
        transit: 1,
        accessibility: 1,
      },
    }));
  }, [cities, getFilteredCities, filters.budget, filters.season]);

  // Memoize hasActiveFilters check
  const hasActiveFilters = useMemo(
    () =>
      filters.search ||
      filters.averageRating ||
      filters.populationCategory ||
      filters.activeTypes.length !== Object.values(CitiesTypeOptions).length,
    [
      filters.search,
      filters.averageRating,
      filters.populationCategory,
      filters.activeTypes,
    ]
  );

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

  const hasMore = useCallback(() => {
    return numPrioritizedToShow < visiblePlacesInView.length;
  }, [numPrioritizedToShow, visiblePlacesInView.length]);

  const loadMore = useCallback(() => {
    if (!hasMore() || isLoadingMore) return;

    setIsLoadingMore(true);
    const timeoutId = setTimeout(() => {
      setNumPrioritizedToShow((prev) => prev + itemsPerPage);
      setIsLoadingMore(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [hasMore, isLoadingMore, setNumPrioritizedToShow, itemsPerPage]);

  // Memoize visible places for MarkerClusterGroup
  const memoizedVisiblePlaces = useMemo(
    () => visiblePlacesInView,
    [visiblePlacesInView]
  );

  return (
    <div className={cn("relative h-full w-full", className)}>
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] hidden sm:block">
        <div className="flex flex-col items-center gap-2">
          {isLoadingMore ? (
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-background/95 backdrop-blur-sm shadow-lg border",
                "text-foreground animate-in fade-in slide-in-from-top-2"
              )}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading more places...</span>
            </div>
          ) : hasMore() ? (
            <Button
              variant="outline"
              size="sm"
              onClick={loadMore}
              className="rounded-full bg-background/95 backdrop-blur-sm shadow-lg hover:bg-accent"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Load more places</span>
            </Button>
          ) : hasActiveFilters && visiblePlacesInView.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-background/95 backdrop-blur-sm shadow-lg border",
                  "text-muted-foreground text-sm sm:text-base"
                )}
              >
                <span className="whitespace-nowrap">
                  All {visiblePlacesInView.length} places loaded
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className={cn(
                  "rounded-full bg-background/95 backdrop-blur-sm shadow-lg hover:bg-accent",
                  "text-sm sm:text-base px-3 sm:px-4"
                )}
              >
                <Filter className="w-4 h-4 mr-1.5 sm:mr-2" />
                <span className="whitespace-nowrap">Clear filters</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-[10]">
        <MapLegend />
      </div>
    </div>
  );
};
