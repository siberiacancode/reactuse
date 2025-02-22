import { useEffect, useState } from 'react';
/**
 * @name useDevicePixelRatio
 * @description - Hook that returns the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device
 * @category Utilities
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
