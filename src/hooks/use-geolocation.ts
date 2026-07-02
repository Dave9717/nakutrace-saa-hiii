import { useEffect, useState } from "react";

export type Coords = { lat: number; lng: number };

interface UseGeolocationOptions {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { watch = false, enableHighAccuracy = true, maximumAge } = options;
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    const onSuccess = (p: GeolocationPosition) => {
      setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
      setError(null);
    };

    const onError = (positionError: GeolocationPositionError) => {
      setError(positionError.message || "Unable to access GPS right now.");
    };

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy,
        maximumAge,
      });
      return () => navigator.geolocation.clearWatch(id);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy,
    });
  }, [watch, enableHighAccuracy, maximumAge]);

  return coords;
}

export function getGeolocationOnce(
  options?: PositionOptions,
): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p.coords),
      () => resolve(null),
      options,
    );
  });
}
