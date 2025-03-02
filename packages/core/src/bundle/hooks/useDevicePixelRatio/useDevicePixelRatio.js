import { useEffect, useState } from 'react';
/**
 * @name useDevicePixelRatio
 * @description - Hook that returns the device's pixel ratio
 * @category Utilities
 *
 * @browserapi window.devicePixelRatio https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
 *
 * @returns {UseDevicePixelRatioReturn} The ratio and supported flag
 *
 * @example
 * const { supported, ratio } = useDevicePixelRatio();
 */
export const useDevicePixelRatio = () => {
    const supported = typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        typeof window.devicePixelRatio === 'number';
    const [ratio, setRatio] = useState(window.devicePixelRatio ?? 1);
    useEffect(() => {
        if (!supported)
            return;
        const onChange = () => setRatio(window.devicePixelRatio);
        const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        media.addEventListener('change', onChange);
        return () => {
            media.removeEventListener('change', onChange);
        };
    }, [ratio]);
    return { supported, ratio };
};
