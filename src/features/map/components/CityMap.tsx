import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useLists } from "@/features/lists/context/ListsContext";
import { useMap } from "@/features/map/context/MapContext";
import { useFilters } from "@/features/places/context/FiltersContext";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { cn } from "@/lib/utils";
import { ratingColors } from "@/lib/utils/colors";
import L, { LatLngTuple } from "leaflet";
import { Filter, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap as useLeafletMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapControls } from "./MapControls";
import { MapMarker } from "./MapMarker";

// Generate smooth curves between points
const generateCurvePoints = (
  start: L.LatLng,
  end: L.LatLng,
  curveIntensity = 0.2
): LatLngTuple[] => {
  const latlngs: LatLngTuple[] = [];
  const offsetX = (end.lng - start.lng) * curveIntensity;
  const offsetY = (end.lat - start.lat) * curveIntensity;

  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const lat = start.lat * (1 - t) + end.lat * t;
    const lng = start.lng * (1 - t) + end.lng * t;
    const offset = Math.sin(Math.PI * t) * offsetY;
    const offsetLng = Math.sin(Math.PI * t) * offsetX;
    latlngs.push([lat + offset, lng + offsetLng]);
  }
  return latlngs;
};

const ErrorFallback = () => (
  <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-xl">
    <div className="text-center p-6">
      <h2 className="text-xl font-semibold mb-2">Map Loading Error</h2>
      <p className="text-gray-600 mb-4">There was an error loading the map.</p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Refresh Page
      </Button>
    </div>
  </div>
);

const BoundsTracker = () => {
  const map = useLeafletMap();
  const { setMapBounds } = useMap();

  useEffect(() => {
    const handleMove = () => {
      const bounds = map.getBounds();
      setMapBounds(bounds);
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedHandleMove = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleMove, 100);
    };

    map.on("moveend", debouncedHandleMove);
    requestAnimationFrame(handleMove);

    return () => {
      clearTimeout(timeoutId);
      map.off("moveend", debouncedHandleMove);
    };
  }, [map, setMapBounds]);

  return null;
};

interface RoadtripRouteProps {
  places: CitiesResponse[];
  weight?: number;
  rating?: number;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const getRatingColor = (rating?: number) => {
  if (!rating) return ratingColors.none;
  if (rating >= 4.95) return ratingColors.best;
  if (rating >= 4.9) return ratingColors.great;
  if (rating >= 4.85) return ratingColors.good;
  if (rating >= 4.8) return ratingColors.okay;
  if (rating >= 4.7) return ratingColors.fair;
  return ratingColors.poor;
};

const RoadtripRoute: React.FC<RoadtripRouteProps> = ({
  places,
  weight = 3,
  rating,
  isHighlighted = false,
  onClick,
}) => {
  console.log("RoadtripRoute places:", places);
  if (places.length < 2) {
    console.log("Not enough places to draw route");
    return null;
  }

  const routeColor = getRatingColor(rating);

  return places.map((place, index) => {
    if (index === places.length - 1) return null;

    const start = new L.LatLng(place.latitude, place.longitude);
    const end = new L.LatLng(
      places[index + 1].latitude,
      places[index + 1].longitude
    );
    console.log(
      "Drawing route segment:",
      place.name,
      "->",
      places[index + 1].name
    );
    const curvePoints = generateCurvePoints(start, end);

    return (
      <Polyline
        key={`${place.id}-${places[index + 1].id}`}
        positions={curvePoints}
        pathOptions={{
          color: isHighlighted ? ratingColors.best : routeColor,
          weight: isHighlighted ? weight + 2 : weight,
          opacity: isHighlighted ? 1 : 0.6,
          lineCap: "round",
          lineJoin: "round",
          dashArray: isHighlighted ? undefined : "10,10",
        }}
        eventHandlers={{
          click: onClick,
        }}
      >
        <Tooltip>
          <div className="p-2">
            <div className="font-semibold mb-1">
              {place.name} → {places[index + 1].name}
            </div>
            {rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </Tooltip>
      </Polyline>
    );
  });
};

// Side panel for route details
const RoutePanel = ({ list, onClose }: any) => (
  <Card className="absolute right-4 top-4 w-80 p-4 z-[400] bg-white/95 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">{list.title}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>
        ×
      </Button>
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">
          {list.averageRating?.toFixed(1) || "New"}
        </span>
      </div>
      <div className="space-y-2">
        {list.places?.map((place: CitiesResponse, index: number) => (
          <div key={place.id} className="flex items-center gap-2">
            <Badge variant="outline" className="w-6 h-6 rounded-full">
              {index + 1}
            </Badge>
            <span>{place.name}</span>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">{list.description}</p>
      </div>
    </div>
  </Card>
);

export const CityMap = () => {
  const { center, zoom, setZoom } = useMap();
  const { visiblePlacesInView, setVisiblePlaces } = useMap();
  const { filters, getFilteredCities, resetFilters, hasActiveFilters } =
    useFilters();
  const { lists, getUserLists } = useLists();
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);

  // Load lists on mount
  useEffect(() => {
    getUserLists().catch(console.error);
  }, [getUserLists]);

  // Filter lists by rating
  const filteredLists = useMemo(() => {
    console.log("Lists:", lists);
    const filtered = lists.filter(
      (list) => (list.averageRating || 0) >= minRating
    );
    console.log("Filtered Lists:", filtered);
    return filtered;
  }, [lists, minRating]);

  const memoizedVisiblePlaces = useMemo(
    () => visiblePlacesInView,
    [visiblePlacesInView]
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative h-full w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <BoundsTracker />
          <MapControls onZoomChange={setZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            keepBuffer={2}
            updateWhenZooming={false}
            updateWhenIdle={true}
          />

          {/* Display all routes by default */}
          {filteredLists.map((list) => {
            console.log(
              "Rendering route for list:",
              list.id,
              list.places?.length
            );
            return (
              <RoadtripRoute
                key={list.id}
                places={list.places || []}
                rating={list.averageRating}
                isHighlighted={list.id === selectedList}
                onClick={() =>
                  setSelectedList(list.id === selectedList ? null : list.id)
                }
              />
            );
          })}

          <MarkerClusterGroup
            chunkedLoading={true}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            removeOutsideVisibleBounds={true}
            disableClusteringAtZoom={15}
            chunkDelay={100}
            zoomToBoundsOnClick={true}
            animate={false}
            spiderfyDistanceMultiplier={2}
            showCoverageOnHover={false}
            maxClusters={100}
          >
            {memoizedVisiblePlaces.map((place) => (
              <MapMarker key={place.id} place={place} />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Rating Filter */}
        <Card className="absolute left-4 top-4 p-4 z-[400] bg-white/95 backdrop-blur-sm">
          <h3 className="font-semibold mb-4">Filter Routes</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Minimum Rating</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{minRating.toFixed(1)}</span>
                </div>
              </div>
              <Slider
                value={[minRating]}
                onValueChange={([value]) => setMinRating(value)}
                max={5}
                step={0.5}
                className="w-48"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredLists.length} routes
            </div>
          </div>
        </Card>

        {/* Route Details Panel */}
        {selectedList && (
          <RoutePanel
            list={lists.find((l) => l.id === selectedList)}
            onClose={() => setSelectedList(null)}
          />
        )}

        {/* Status Indicator */}
        {hasActiveFilters() && visiblePlacesInView.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10] hidden sm:block">
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
    </ErrorBoundary>
  );
};
