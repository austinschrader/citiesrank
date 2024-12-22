import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useMap } from '@/features/map/context/MapContext';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  type?: 'city' | 'region' | 'neighborhood' | 'sight' | 'country';
}

export function LocationMap({ latitude, longitude, className, type = 'city' }: LocationMapProps) {
  const navigate = useNavigate();
  const { setCenter, setZoom } = useMap();

  // Get zoom level based on place type
  const getZoomLevel = () => {
    switch (type) {
      case 'country':
        return 5; // Very zoomed out for countries
      case 'region':
        return 7; // Zoomed out for regions/states
      case 'city':
        return 11; // City level view
      case 'neighborhood':
        return 14; // Detailed neighborhood view
      case 'sight':
        return 16; // Very detailed for specific sights
      default:
        return 13;
    }
  };

  const handleBackToMap = () => {
    // Update map state directly through context
    const newZoom = getZoomLevel();
    const newCenter: [number, number] = [latitude, longitude];
    
    setZoom(newZoom);
    setCenter(newCenter);
    
    // Navigate without state since we've already set it
    navigate('/');
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={handleBackToMap}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 z-[1000] pointer-events-none flex items-center justify-center">
        <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          View Full Map
        </div>
      </div>
      <MapContainer
        center={[latitude, longitude]}
        zoom={getZoomLevel()}
        className={cn("h-full w-full rounded-xl relative z-0", className)}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}
