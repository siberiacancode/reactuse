import { useEffect, useState } from 'react';
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
export const useGeolocation = (params) => {
    const [value, setValue] = useState({
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
        const onEvent = ({ coords, timestamp }) => {
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
        const onEventError = (error) => {
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
