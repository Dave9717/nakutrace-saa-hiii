import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "@/hooks/use-geolocation";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker() {
  const coords = useGeolocation();
  return coords ? <Marker position={[coords.lat, coords.lng]} /> : null;
}

export default function MapPage() {
  return (
    <div className="liquid-glass h-screen relative wildlife-bg overflow-hidden">
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={12}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <LocationMarker />
      </MapContainer>

      {/* Floating Animals */}
      <motion.div
        className="animal-float absolute top-20 left-10 text-6xl z-10"
        animate={{ rotate: [-10, 10] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🦒
      </motion.div>
      <motion.div
        className="animal-float absolute bottom-32 right-16 text-5xl z-10"
        animate={{ y: [-15, 15] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🐘
      </motion.div>
      <motion.div
        className="animal-float absolute top-1/3 right-1/4 text-5xl z-10"
        animate={{ rotate: [0, 15] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        🦁
      </motion.div>
    </div>
  );
}
