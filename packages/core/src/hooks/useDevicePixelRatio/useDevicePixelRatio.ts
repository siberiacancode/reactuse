import { useEffect, useState } from 'react';

/** The use device pixel ratio return type */
export interface UseDevicePixelRatioReturn {
  /** Whether the device pixel ratio is supported*/
  supported: boolean;
  /** The ratio of the resolution in physical pixels to the resolution in CSS pixels */
  value: number;
}

/**
 * @name useDevicePixelRatio
 * @description - Hook that returns the device's pixel ratio
 * @category Utilities
 * @usage low
 *
 * @browserapi window.devicePixelRatio https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
 *
 * @returns {UseDevicePixelRatioReturn} The ratio and supported flag
 *
 * @example
 * const { supported, value } = useDevicePixelRatio();
 */
export const useDevicePixelRatio = (): UseDevicePixelRatioReturn => {
  const supported =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    typeof window.devicePixelRatio === 'number';

  const [value, setValue] = useState(supported ? window.devicePixelRatio : 1);

  useEffect(() => {
    if (!supported) return;

    const onChange = () => setValue(window.devicePixelRatio);

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [value]);

  return { supported, value };
};
