import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

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
      center,
      zoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    return () => map.remove();
  }, [center, zoom]);
  return <div ref={ref} className={className} />;
}