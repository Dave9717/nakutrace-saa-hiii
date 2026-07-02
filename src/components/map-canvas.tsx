import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useGeolocation } from "@/hooks/use-geolocation";

export function MapCanvas({
  center = [37.5, 0.5] as [number, number],
  zoom = 5,
  className = "h-full w-full",
}: {
  center?: [number, number];
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const coords = useGeolocation({ watch: true, enableHighAccuracy: true, maximumAge: 1000 });
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const position = useMemo<[number, number]>(() => {
    if (coords) return [coords.lng, coords.lat];
    return center;
  }, [center, coords]);

  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: position,
      zoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    setMapInstance(map);
    return () => {
      map.remove();
      setMapInstance(null);
    };
  }, [position[0], position[1], zoom]);

  useEffect(() => {
    if (!mapInstance || !coords) return;
    mapInstance.flyTo({
      center: [coords.lng, coords.lat],
      zoom: Math.max(mapInstance.getZoom(), 12),
    });

    const marker = new maplibregl.Marker({ color: "#0f766e" })
      .setLngLat([coords.lng, coords.lat])
      .addTo(mapInstance);

    return () => {
      marker.remove();
    };
  }, [coords, mapInstance]);

  return <div ref={ref} className={className} />;
}
