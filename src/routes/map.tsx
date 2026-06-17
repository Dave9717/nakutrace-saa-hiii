import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({ locationfound(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.log('Location access denied'),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return position ? <Marker position={position} /> : null;
}

export default function MapPage() {
  return (
    <div className="liquid-glass h-screen relative overflow-hidden wildlife-bg">
      <MapContainer center={[-1.2921, 36.8219]} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <LocationMarker />
      </MapContainer>

      <motion.div className="animal-float absolute top-20 left-10 text-6xl" animate={{ rotate: [-10, 10] }} transition={{ duration: 4, repeat: Infinity }}>
        🦒
      </motion.div>
      <motion.div className="animal-float absolute bottom-32 right-16 text-5xl" animate={{ y: [-15, 15] }} transition={{ duration: 5, repeat: Infinity }}>
        🐘
      </motion.div>
    </div>
  );
}