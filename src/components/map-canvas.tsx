import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

/**
 * Run a style-mutating callback only once the MapLibre style is fully loaded.
 * Safe against `Error: Style is not done loading` and against calls after unmount.
 */
function whenStyleReady(map: maplibregl.Map, cb: () => void, disposedRef: { current: boolean }) {
  const run = () => {
    if (disposedRef.current) return;
    try {
      cb();
    } catch (err) {
      console.warn("[MapCanvas] style op failed:", err);
    }
  };
  if (map.isStyleLoaded()) {
    run();
    return () => {};
  }
  const handler = () => {
    if (!map.isStyleLoaded()) return;
    map.off("load", handler);
    map.off("styledata", handler);
    run();
  };
  map.on("load", handler);
  map.on("styledata", handler);
  return () => {
    map.off("load", handler);
    map.off("styledata", handler);
  };
}

export function MapCanvas({
  center = [37.5, 0.5] as [number, number],
  zoom = 5,
  className = "h-full w-full",
  offlineBoundary,
}: {
  center?: [number, number];
  zoom?: number;
  className?: string;
  /** Optional GeoJSON polygon marking a cached / offline-available area. */
  offlineBoundary?: GeoJSON.Feature | GeoJSON.FeatureCollection | any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const disposedRef = { current: false };
    const cleanups: Array<() => void> = [];

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

    const nav = new maplibregl.NavigationControl({ showCompass: true });
    map.addControl(nav, "top-right");

    // Swallow non-fatal runtime errors (tile 4xx, aborted requests) so they
    // don't bubble to the React error boundary.
    const onError = (e: { error?: Error }) => {
      console.warn("[MapCanvas] runtime:", e?.error?.message ?? e);
    };
    map.on("error", onError);
    cleanups.push(() => map.off("error", onError));

    // Offline boundary overlay — added only once style is ready, and only
    // if source/layer IDs aren't already present.
    if (offlineBoundary) {
      const off = whenStyleReady(
        map,
        () => {
          const SRC = "offline-boundary";
          const FILL = "offline-boundary-fill";
          const LINE = "offline-boundary-line";
          if (!map.getSource(SRC)) {
            map.addSource(SRC, { type: "geojson", data: offlineBoundary });
          } else {
            (map.getSource(SRC) as maplibregl.GeoJSONSource).setData(offlineBoundary);
          }
          if (!map.getLayer(FILL)) {
            map.addLayer({
              id: FILL,
              type: "fill",
              source: SRC,
              paint: { "fill-color": "#D4A017", "fill-opacity": 0.12 },
            });
          }
          if (!map.getLayer(LINE)) {
            map.addLayer({
              id: LINE,
              type: "line",
              source: SRC,
              paint: { "line-color": "#D4A017", "line-width": 1.5, "line-dasharray": [2, 2] },
            });
          }
        },
        disposedRef,
      );
      cleanups.push(off);
    }

    return () => {
      disposedRef.current = true;
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* noop */
        }
      });
      map.remove();
    };
  }, [center, zoom, offlineBoundary]);

  return <div ref={ref} className={className} />;
}