import { useEffect, useRef, useState } from 'react';
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
 * @param {boolean} [params.immediately=true] Start watching immediately
 * @param {boolean} [params.enableHighAccuracy] Enable high accuracy
 * @param {number} [params.maximumAge] Maximum age
 * @param {number} [params.timeout] Timeout
 * @returns {UseGeolocationReturn} An object containing the geolocation state and controls
 *
 * @example
 * const { value, start, stop, watching } = useGeolocation(() => console.log('callback'));
 *
 * @overload
 * @param {UseGeolocationOptions} [options] Configuration options
 * @param {boolean} [options.immediately=true] Start watching immediately on mount
 * @param {(position: GeolocationPosition) => void} [options.onChange] The callback function to be invoked when geolocation changes
 * @param {(error: GeolocationPositionError) => void} [options.onError] The callback function to be invoked on geolocation error
 * @param {boolean} [options.enableHighAccuracy] Enable high accuracy
 * @param {number} [options.maximumAge] Maximum age
 * @param {number} [options.timeout] Timeout
 * @returns {UseGeolocationReturn} An object containing the geolocation state and controls
 *
 * @example
 * const { value, start, stop, watching } = useGeolocation({ immediately: false });
 */
export const useGeolocation = (...params) => {
  const options =
    typeof params[0] === 'function' ? { ...params[1], onChange: params[0] } : params[0];
  const immediately = options?.immediately ?? true;
  const [value, setValue] = useState({
    loading: immediately,
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
  const [watching, setWatching] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const watchIdRef = useRef(null);
  const onEvent = (position) => {
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
  const onError = (error) => {
    setValue((currentValue) => ({
      ...currentValue,
      loading: false,
      error
    }));
    optionsRef.current?.onError?.(error);
  };
  const get = () => {
    setValue((currentValue) => ({ ...currentValue, loading: true }));
    navigator.geolocation.getCurrentPosition(onEvent, onError, optionsRef.current);
  };
  const start = () => {
    if (watchIdRef.current !== null) return;
    setValue((currentValue) => ({ ...currentValue, loading: true }));
    navigator.geolocation.getCurrentPosition(onEvent, onError, optionsRef.current);
    watchIdRef.current = navigator.geolocation.watchPosition(onEvent, onError, optionsRef.current);
    setWatching(true);
  };
  const stop = () => {
    if (!watchIdRef.current) return;
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setWatching(false);
  };
  useEffect(() => {
    if (!immediately) return;
    start();
    return () => {
      stop();
    };
  }, [options?.enableHighAccuracy, options?.maximumAge, options?.timeout, immediately]);
  return { value, watching, start, stop, get };
};
