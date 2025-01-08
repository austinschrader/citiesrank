// src/features/map/components/MapCluster.tsx
/**
 * Renders map markers for prioritized places with efficient clustering.
 * Uses MapMarker component to display individual places
 * and handles marker selection with memoization to prevent re-renders.
 */

import { useEffect, useMemo, useState } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import { MapMarker } from "./MapMarker";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import Supercluster from "supercluster";
import { BBox, Feature, Point } from "geojson";

type ClusterProperties = {
  cluster?: boolean;
  placeId?: string;
  placeData?: CitiesResponse;
  point_count?: number;
  point_count_abbreviated?: string;
  cluster_id?: number;
};

type ClusterFeature = Feature<Point, ClusterProperties> & {
  properties: ClusterProperties & {
    cluster: true;
    point_count: number;
    point_count_abbreviated: string;
    cluster_id: number;
  };
};

type PointFeature = Feature<Point, ClusterProperties> & {
  properties: ClusterProperties & {
    cluster: false;
    placeId: string;
    placeData: CitiesResponse;
  };
};

type MapFeature = ClusterFeature | PointFeature;

export const MapCluster = () => {
  const { prioritizedPlaces, selectPlace } = useMap();
  const map = useLeafletMap();
  const [clusters, setClusters] = useState<MapFeature[]>([]);
  const [currentZoom, setCurrentZoom] = useState(map?.getZoom() || 0);

  // Create the supercluster instance
  const supercluster = useMemo(() => {
    const points = prioritizedPlaces.map((place) => ({
      type: "Feature" as const,
      properties: {
        cluster: false as const,
        placeId: place.id,
        placeData: place,
        point_count: 1,
        point_count_abbreviated: "1"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [
          Number(place.longitude) || 0,
          Number(place.latitude) || 0
        ]
      }
    }));

    const index = new Supercluster<ClusterProperties>({
      radius: 60,
      maxZoom: 16,
      minZoom: 0,
      map: (props) => ({
        placeId: props.placeId,
        placeData: props.placeData
      }),
      reduce: (accumulated, props) => {
        // Keep track of the highest rated place in the cluster
        if (!accumulated.placeData || 
            (props.placeData && props.placeData.averageRating > (accumulated.placeData.averageRating || 0))) {
          accumulated.placeData = props.placeData;
          accumulated.placeId = props.placeId;
        }
      }
    });
    
    index.load(points);
    return index;
  }, [prioritizedPlaces]);

  // Update clusters when the map moves
  useEffect(() => {
    if (!map) return;

    const updateClusters = () => {
      const bounds = map.getBounds();
      const bbox: BBox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ];

      const zoom = Math.round(map.getZoom());
      setCurrentZoom(zoom);
      const newClusters = supercluster.getClusters(bbox, zoom) as MapFeature[];
      setClusters(newClusters);
    };

    updateClusters();
    map.on('moveend', updateClusters);
    map.on('zoomend', updateClusters);

    return () => {
      map.off('moveend', updateClusters);
      map.off('zoomend', updateClusters);
    };
  }, [map, supercluster]);

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;

        // If it's a cluster
        if (cluster.properties.cluster) {
          // Get the zoom level where this cluster expands
          let expansionZoom = currentZoom;
          try {
            if (cluster.properties.cluster_id) {
              expansionZoom = Math.min(
                supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
                16
              );
            }
          } catch (error) {
            console.warn('Could not get expansion zoom for cluster:', error);
            // Default to zooming in by 2 levels if we can't get the expansion zoom
            expansionZoom = Math.min(currentZoom + 2, 16);
          }

          // Use the place data from the cluster properties
          const representativePlace = cluster.properties.placeData;
          if (!representativePlace) return null;

          return (
            <MapMarker
              key={`cluster-${cluster.properties.cluster_id || Date.now()}`}
              place={representativePlace}
              onSelect={() => {
                map?.setView(
                  [latitude, longitude],
                  expansionZoom,
                  { animate: true }
                );
              }}
              clusterCount={cluster.properties.point_count}
            />
          );
        }

        // Single point
        return (
          <MapMarker
            key={cluster.properties.placeId}
            place={cluster.properties.placeData}
            onSelect={selectPlace}
          />
        );
      })}
    </>
  );
};
