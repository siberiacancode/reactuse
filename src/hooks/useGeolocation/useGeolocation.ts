import { useEffect, useState } from 'react';

export interface UseGeolocationReturn {
  loading: boolean;
  error: GeolocationPositionError | null;
  timestamp: number | null;
  accuracy: number | null;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

/**
 * @name useGeolocation
 * @description - Hook that returns the current geolocation
 * @category Browser
 *
 * @param {boolean} [options.enableHighAccuracy] Enable high accuracy
 * @param {number} [options.maximumAge] Maximum age
 * @param {number} [options.timeout] Timeout
 * @returns {UseGeolocationReturn}
 *
 * @example
 * const { loading, error, timestamp, accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed } = useGeolocation();
 */
export const useGeolocation = (options?: PositionOptions): UseGeolocationReturn => {
  const [value, setValue] = useState<{
    loading: boolean;
    error: GeolocationPositionError | null;
    timestamp: number | null;
    accuracy: number | null;
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  }>({
    loading: true,
    error: null,
    timestamp: Date.now(),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });

  useEffect(() => {
    const onEvent = ({ coords, timestamp }: GeolocationPosition) => {
      setValue({
        ...value,
        loading: false,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed
      });
    };

    const onEventError = (error: GeolocationPositionError) => {
      setValue({
        ...value,
        loading: false,
        error
      });
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
    const watchId = navigator.geolocation.watchPosition(onEvent, onEventError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options?.enableHighAccuracy, options?.maximumAge, options?.timeout]);

  return value;
};
