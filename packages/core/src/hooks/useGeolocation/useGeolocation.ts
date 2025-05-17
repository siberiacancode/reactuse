import { useEffect, useState } from 'react';

/** The use geolocation return type */
export interface UseGeolocationReturn {
  /** The accuracy of the last position update */
  accuracy: number | null;
  /** The altitude of the last position update */
  altitude: number | null;
  /** The altitude accuracy of the last position update */
  altitudeAccuracy: number | null;
  /** The error of the last position update */
  error: GeolocationPositionError | null;
  /** The heading of the last position update */
  heading: number | null;
  /** The latitude of the last position update */
  latitude: number | null;
  /** The loading state */
  loading: boolean;
  /** The longitude of the last position update */
  longitude: number | null;
  /** The speed of the last position update */
  speed: number | null;
  /** The timestamp of the last position update */
  timestamp: number | null;
}

/** The use geolocation params type */
export type UseGeolocationParams = PositionOptions;

/**
 * @name useGeolocation
 * @description - Hook that returns the current geolocation
 * @category Browser
 *
 * @browserapi navigator.geolocation https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
 *
 * @param {boolean} [params.enableHighAccuracy] Enable high accuracy
 * @param {number} [params.maximumAge] Maximum age
 * @param {number} [params.timeout] Timeout
 * @returns {UseGeolocationReturn}
 *
 * @example
 * const { loading, error, timestamp, accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed } = useGeolocation();
 */
export const useGeolocation = (params?: UseGeolocationParams): UseGeolocationReturn => {
  const [value, setValue] = useState<UseGeolocationReturn>({
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

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, params);
    const watchId = navigator.geolocation.watchPosition(onEvent, onEventError, params);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [params?.enableHighAccuracy, params?.maximumAge, params?.timeout]);

  return value;
};
