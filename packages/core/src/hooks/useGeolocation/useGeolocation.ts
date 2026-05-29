import { useEffect, useRef, useState } from 'react';

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

/** The use geolocation callback type */
export type UseGeolocationCallback = (position: GeolocationPosition) => void;

/** The use geolocation options type */
export interface UseGeolocationOptions extends PositionOptions {
  /** The callback function to be invoked when the geolocation changes */
  onChange?: UseGeolocationCallback;
  /** The callback function to be invoked when geolocation errors */
  onError?: (error: GeolocationPositionError) => void;
}

export interface UseGeolocation {
  (callback?: UseGeolocationCallback, options?: PositionOptions): UseGeolocationReturn;

  (options?: UseGeolocationOptions): UseGeolocationReturn;
}

/**
 * @name useGeolocation
 * @description - Hook that returns the current geolocation
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.geolocation https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
 *
 * @overload
 * @param {UseGeolocationCallback} [callback] The callback function to be invoked when geolocation changes
 * @param {boolean} [params.enableHighAccuracy] Enable high accuracy
 * @param {number} [params.maximumAge] Maximum age
 * @param {number} [params.timeout] Timeout
 * @returns {UseGeolocationReturn}
 *
 * @example
 * const { loading, error, timestamp, accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed } = useGeolocation((position) => console.log(position));
 *
 * @overload
 * @param {UseGeolocationOptions} [options] Configuration options
 * @param {(position: GeolocationPosition) => void} [options.onChange] The callback function to be invoked when geolocation changes
 * @param {(error: GeolocationPositionError) => void} [options.onError] The callback function to be invoked on geolocation error
 * @param {boolean} [options.enableHighAccuracy] Enable high accuracy
 * @param {number} [options.maximumAge] Maximum age
 * @param {number} [options.timeout] Timeout
 * @returns {UseGeolocationReturn}
 *
 * @example
 * const { loading, error, timestamp, accuracy, latitude, longitude, altitude, altitudeAccuracy, heading, speed } = useGeolocation();
 */
export const useGeolocation = ((...params: any[]) => {
  const options = (
    typeof params[0] === 'function' ? { ...params[1], onChange: params[0] } : params[0]
  ) as UseGeolocationOptions | undefined;

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
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const onEvent = (position: GeolocationPosition) => {
      const { coords, timestamp } = position;

      setValue((currentValue) => ({
        ...currentValue,
        loading: false,
        error: null,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed
      }));

      optionsRef.current?.onChange?.(position);
    };

    const onEventError = (error: GeolocationPositionError) => {
      setValue((currentValue) => ({
        ...currentValue,
        loading: false,
        error
      }));

      optionsRef.current?.onError?.(error);
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, optionsRef.current);
    const watchId = navigator.geolocation.watchPosition(onEvent, onEventError, optionsRef.current);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options?.enableHighAccuracy, options?.maximumAge, options?.timeout]);

  return value;
}) as UseGeolocation;
