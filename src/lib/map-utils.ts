/**
 * Map utilities for route rendering, offline cache boundaries, and geospatial calculations
 */

export interface RouteData {
  coordinates: [number, number][];
  distance?: number;
  eta?: string;
  terrain?: string;
}

export interface OfflineBoundary {
  coordinates: Array<[number, number]>;
  name?: string;
  region?: string;
}

/**
 * Calculate bearing between two coordinates
 * Returns bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos(dLon);

  const bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360;
}

/**
 * Convert bearing degrees to cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
export function bearingToCardinal(bearing: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}

/**
 * Calculate haversine distance between two coordinates
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mock route data generator (replace with real navigation engine)
 */
export function generateMockRoute(): RouteData {
  // Example: Route from Nairobi (center) to Samburu National Reserve
  return {
    coordinates: [
      [37.5, 0.5], // Start
      [37.6, 0.4],
      [37.7, 0.3],
      [37.8, 0.15],
      [37.85, 0.05],
      [37.9, -0.1], // Destination
    ],
    distance: 184,
    eta: "3h 42m",
    terrain: "Hard",
  };
}

/**
 * Mock offline boundary (replace with real offline data bounds)
 */
export function generateMockOfflineBoundary(): OfflineBoundary {
  // Example: A rectangular boundary around central Kenya
  return {
    coordinates: [
      [36.5, 1.5],
      [38.5, 1.5],
      [38.5, -0.5],
      [36.5, -0.5],
      [36.5, 1.5], // Close the polygon
    ],
    name: "Central Kenya Cache",
    region: "Kenya",
  };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  const latAbs = Math.abs(lat).toFixed(4);
  const lonAbs = Math.abs(lon).toFixed(4);
  return `${latAbs}° ${latDir} / ${lonAbs}° ${lonDir}`;
}

/**
 * Format bearing with cardinal direction
 */
export function formatBearing(bearing: number): string {
  const cardinal = bearingToCardinal(bearing);
  return `${Math.round(bearing)}° ${cardinal}`;
}
