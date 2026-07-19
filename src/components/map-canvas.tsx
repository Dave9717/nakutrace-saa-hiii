import { useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSourceSpecification } from "maplibre-gl";
import { RouteData, OfflineBoundary } from "@/lib/map-utils";

/**
 * Run a style-mutating callback only once the MapLibre style is fully loaded.
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
  routeData,
  offlineBoundary,
}: {
  center?: [number, number];
  zoom?: number;
  className?: string;
  routeData?: RouteData;
  offlineBoundary?: OfflineBoundary;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [compass, setCompass] = useState(0);

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
      bearing: 0,
      pitch: 0,
    });

    mapRef.current = map;

    // Add navigation control with compass
    const nav = new maplibregl.NavigationControl({ showCompass: true });
    map.addControl(nav, "top-right");

    // Listen to bearing changes for compass HUD
    const updateCompass = () => {
      const bearing = map.getBearing();
      setCompass((bearing + 360) % 360);
    };

    map.on("rotate", updateCompass);
    cleanups.push(() => map.off("rotate", updateCompass));

    // Swallow non-fatal runtime errors (tile 4xx, aborted requests) so they
    // don't bubble to the React error boundary.
    const onError = (e: { error?: Error }) => {
      console.warn("[MapCanvas] runtime:", e?.error?.message ?? e);
    };
    map.on("error", onError);
    cleanups.push(() => map.off("error", onError));

    // Offline cache boundary layer — added only once style is ready
    if (offlineBoundary) {
      const off = whenStyleReady(
        map,
        () => {
          addOfflineBoundary(map, offlineBoundary);
        },
        disposedRef,
      );
      cleanups.push(off);
    }

    // Route rendering — added only once style is ready
    if (routeData) {
      const off = whenStyleReady(
        map,
        () => {
          addRouteLayer(map, routeData);
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
  }, [center, zoom, offlineBoundary, routeData]);

  return (
    <div ref={ref} className={className} />
  );
}

// Add offline cache boundary visualization
function addOfflineBoundary(map: maplibregl.Map, boundary: OfflineBoundary) {
  // Remove existing sources/layers if present
  if (map.getSource("offline-boundary")) {
    map.removeLayer("offline-boundary-border");
    map.removeSource("offline-boundary");
  }
  if (map.getSource("offline-mask")) {
    map.removeLayer("offline-mask");
    map.removeSource("offline-mask");
  }

  // GeoJSON polygon for the offline region
  const boundaryGeoJSON: GeoJSONSourceSpecification["data"] = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [boundary.coordinates],
        },
        properties: {},
      },
    ],
  };

  map.addSource("offline-boundary", {
    type: "geojson",
    data: boundaryGeoJSON,
  });

  // Add mask effect using an inverted polygon (world polygon with boundary as hole)
  // This creates the effect of the inside being clear and outside being dark
  // The hole ring must be a reversed copy of the boundary ring for correct winding order
  const holeRing = [...boundary.coordinates].reverse();
  map.addSource("offline-mask", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-180, 90],
                [180, 90],
                [180, -90],
                [-180, -90],
                [-180, 90],
              ],
              holeRing,
            ],
          },
          properties: {},
        },
      ],
    },
  });

  // Mask layer — placed AFTER the OSM layer (no beforeId) so it renders on top
  map.addLayer({
    id: "offline-mask",
    type: "fill",
    source: "offline-mask",
    paint: {
      "fill-color": "#0a0a0a",
      "fill-opacity": 0.4,
    },
  });

  // Border with dashed line — placed on top of the mask
  map.addLayer({
    id: "offline-boundary-border",
    type: "line",
    source: "offline-boundary",
    paint: {
      "line-color": "#4ade80", // Tactical green
      "line-width": 2.5,
      "line-dasharray": [5, 5],
      "line-opacity": 0.8,
    },
  });
}

// Add active route rendering
function addRouteLayer(map: maplibregl.Map, routeData: RouteData) {
  // Remove existing route layers if present
  if (map.getSource("route")) {
    map.removeLayer("route-line");
    map.removeLayer("route-start-marker");
    map.removeLayer("route-end-marker");
    map.removeSource("route");
    map.removeSource("route-points");
  }

  // Main route line
  map.addSource("route", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeData.coordinates,
      },
      properties: {},
    },
  });

  // Route line with glow effect
  map.addLayer({
    id: "route-line-glow",
    type: "line",
    source: "route",
    paint: {
      "line-color": "#ff8c42", // Tactical orange
      "line-width": 8,
      "line-opacity": 0.2,
      "line-blur": 4,
    },
  });

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#ff8c42", // Bright tactical orange
      "line-width": 4,
      "line-opacity": 0.95,
    },
  });

  // Start and end markers
  map.addSource("route-points", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: routeData.coordinates[0],
          },
          properties: { type: "start" },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: routeData.coordinates[routeData.coordinates.length - 1],
          },
          properties: { type: "end" },
        },
      ],
    },
  });

  // Marker circle layer
  map.addLayer({
    id: "route-start-marker",
    type: "circle",
    source: "route-points",
    filter: ["==", ["get", "type"], "start"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#4ade80", // Green for start
      "circle-opacity": 1,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: "route-end-marker",
    type: "circle",
    source: "route-points",
    filter: ["==", ["get", "type"], "end"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#ef4444", // Red for destination
      "circle-opacity": 1,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  // Animate route (subtle pulse effect)
  let animationFrame: number;
  let opacity = 0.95;
  let increasing = false;
  let isCancelled = false;

  const animate = () => {
    if (isCancelled) return;
    if (increasing) {
      opacity = Math.min(opacity + 0.01, 1);
      if (opacity === 1) increasing = false;
    } else {
      opacity = Math.max(opacity - 0.01, 0.7);
      if (opacity === 0.7) increasing = true;
    }

    try {
      map.setPaintProperty("route-line", "line-opacity", opacity);
    } catch {
      // Map may have been removed
      isCancelled = true;
      return;
    }
    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);

  // Return cleanup — though in practice this runs outside React's effect cycle,
  // the map.remove() in the parent useEffect will clean up the layers
  return () => {
    isCancelled = true;
    cancelAnimationFrame(animationFrame);
  };
}