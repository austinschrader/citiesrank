import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  iconUrl: "/images/leaflet/marker-icon.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
});

interface LocationMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  type?: "city" | "region" | "neighborhood" | "sight" | "country";
}

export function LocationMap({
  latitude,
  longitude,
  className,
  type = "city",
}: LocationMapProps) {
  // Get zoom level based on place type
  const getZoomLevel = () => {
    switch (type) {
      case "country":
        return 5; // Very zoomed out for countries
      case "region":
        return 7; // Zoomed out for regions/states
      case "city":
        return 11; // City level view
      case "neighborhood":
        return 14; // Detailed neighborhood view
      case "sight":
        return 16; // Very detailed for specific sights
      default:
        return 13;
    }
  };

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={getZoomLevel()}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}
