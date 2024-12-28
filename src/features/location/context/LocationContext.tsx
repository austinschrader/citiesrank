import { createContext, useContext, useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface LocationContextValue {
  // Current location name (e.g., "San Francisco")
  currentLocation: string | null;
  setCurrentLocation: (location: string | null) => void;
  
  // Precise coordinates
  coordinates: Coordinates | null;
  setCoordinates: (coords: Coordinates | null) => void;
  
  // Viewport bounds
  bounds: LocationBounds | null;
  setBounds: (bounds: LocationBounds | null) => void;
  
  // Location history for quick navigation
  recentLocations: string[];
  addRecentLocation: (location: string) => void;
  
  // Utility functions
  isWithinBounds: (coords: Coordinates) => boolean;
  getDistance: (coords: Coordinates) => number | null;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [bounds, setBounds] = useState<LocationBounds | null>(null);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);

  const addRecentLocation = (location: string) => {
    setRecentLocations((prev) => {
      const filtered = prev.filter((loc) => loc !== location);
      return [location, ...filtered].slice(0, 5); // Keep last 5 locations
    });
  };

  const isWithinBounds = (coords: Coordinates): boolean => {
    if (!bounds) return false;
    return (
      coords.lat <= bounds.north &&
      coords.lat >= bounds.south &&
      coords.lng <= bounds.east &&
      coords.lng >= bounds.west
    );
  };

  const getDistance = (coords: Coordinates): number | null => {
    if (!coordinates) return null;
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coords.lat - coordinates.lat);
    const dLon = toRad(coords.lng - coordinates.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coordinates.lat)) *
        Math.cos(toRad(coords.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const clearLocation = () => {
    setCurrentLocation(null);
    setCoordinates(null);
    setBounds(null);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        coordinates,
        setCoordinates,
        bounds,
        setBounds,
        recentLocations,
        addRecentLocation,
        isWithinBounds,
        getDistance,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

// Helper function for distance calculation
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
