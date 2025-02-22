import { useEffect, useState } from 'react';
/**
 * @name useDeviceOrientation
 * @description - Hook that provides the current device orientation
 * @category Sensors
 *
 * @returns {UseDeviceOrientationReturn} The current device orientation
 *
 * @example
 * const { supported, value } = useDeviceOrientation();
 */
export const useDeviceOrientation = () => {
    const supported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
    const [value, setValue] = useState({
        alpha: null,
        beta: null,
        gamma: null,
        absolute: false
    });
    useEffect(() => {
        if (!supported)
            return;
        const onDeviceOrientation = (event) => setValue({
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma,
            absolute: event.absolute
        });
        window.addEventListener('deviceorientation', onDeviceOrientation);
        return () => {
            window.removeEventListener('deviceorientation', onDeviceOrientation);
        };
    }, []);
    return {
        supported,
        value
    };
};
