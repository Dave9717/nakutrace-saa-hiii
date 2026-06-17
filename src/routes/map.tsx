import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const Route = createFileRoute('/map')({
  head: () => ({ meta: [{ title: 'Map — NAKUTRACE SAI' }] }),
  component: MapPage,
});

type Pin = { id: string; lat: number; lng: number; kind: 'sos' | 'report'; label: string; severity?: string };

const sosIcon = L.divIcon({
  className: '',
  html: '<div style="background:#ef4444;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(239,68,68,.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const reportIcon = L.divIcon({
  className: '',
  html: '<div style="background:#f59e0b;width:14px;height:14px;border-radius:50%;border:2px solid white"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({ locationfound(e: L.LocationEvent) { setPosition([e.latlng.lat, e.latlng.lng]); } });

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

function MapPage() {
  const [sos, setSos] = useState<Pin[]>([]);
  const [reports, setReports] = useState<Pin[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const [{ data: a }, { data: r }] = await Promise.all([
        supabase.from('sos_alerts').select('id,message,severity,latitude,longitude,status').eq('status', 'active').limit(100),
        supabase.from('community_reports').select('id,title,kind,severity,latitude,longitude').limit(200),
      ]);
      if (cancel) return;
      setSos((a ?? []).filter((x: any) => x.latitude && x.longitude).map((x: any) => ({ id: x.id, lat: x.latitude, lng: x.longitude, kind: 'sos', label: x.message ?? 'Emergency', severity: x.severity })));
      setReports((r ?? []).filter((x: any) => x.latitude && x.longitude).map((x: any) => ({ id: x.id, lat: x.latitude, lng: x.longitude, kind: 'report', label: `${x.kind}: ${x.title}`, severity: x.severity })));
    })();
    const ch = supabase
      .channel('map-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sos_alerts' }, (p: any) => {
        const row = p.new ?? p.old;
        if (!row?.latitude || !row?.longitude) return;
        setSos((prev) => {
          const others = prev.filter((x) => x.id !== row.id);
          if (p.eventType === 'DELETE' || row.status !== 'active') return others;
          return [{ id: row.id, lat: row.latitude, lng: row.longitude, kind: 'sos', label: row.message ?? 'Emergency', severity: row.severity }, ...others];
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_reports' }, (p: any) => {
        const row = p.new ?? p.old;
        if (!row?.latitude || !row?.longitude) return;
        setReports((prev) => {
          const others = prev.filter((x) => x.id !== row.id);
          if (p.eventType === 'DELETE') return others;
          return [{ id: row.id, lat: row.latitude, lng: row.longitude, kind: 'report', label: `${row.kind}: ${row.title}`, severity: row.severity }, ...others];
        });
      })
      .subscribe();
    return () => { cancel = true; supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="liquid-glass h-screen relative overflow-hidden wildlife-bg">
      <MapContainer center={[-1.2921, 36.8219]} zoom={12} className="h-full w-full" zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        <LocationMarker />
        {sos.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={sosIcon}>
            <Popup><div className="text-xs"><strong>SOS:</strong> {p.label}<br/>Severity: {p.severity}</div></Popup>
          </Marker>
        ))}
        {reports.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={reportIcon}>
            <Popup><div className="text-xs">{p.label}<br/>Severity: {p.severity}</div></Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] flex gap-2">
        <Badge variant="destructive">SOS: {sos.length}</Badge>
        <Badge variant="secondary">Reports: {reports.length}</Badge>
      </div>

      <motion.div className="animal-float absolute top-20 left-10 text-6xl" animate={{ rotate: [-10, 10] }} transition={{ duration: 4, repeat: Infinity }}>
        🦒
      </motion.div>
      <motion.div className="animal-float absolute bottom-32 right-16 text-5xl" animate={{ y: [-15, 15] }} transition={{ duration: 5, repeat: Infinity }}>
        🐘
      </motion.div>
    </div>
  );
}