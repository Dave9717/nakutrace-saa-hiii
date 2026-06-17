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

  useEffect(() => {
    if (!navigator.geolocation) return;

    const onSuccess = (p: GeolocationPosition) =>
      setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, () => {}, {
        enableHighAccuracy,
        maximumAge,
      });
      return () => navigator.geolocation.clearWatch(id);
    }

    navigator.geolocation.getCurrentPosition(onSuccess, () => {}, {
      enableHighAccuracy,
    });
  }, [watch, enableHighAccuracy, maximumAge]);

  return coords;
}

export function getGeolocationOnce(
  options?: PositionOptions,
): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p.coords),
      () => resolve(null),
      options,
    );
  });
}
