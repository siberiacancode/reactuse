import { useEffect, useState } from 'react';

/** The use device pixel ratio return type */
export interface UseDevicePixelRatioReturn {
  /** The ratio of the resolution in physical pixels to the resolution in CSS pixels */
  ratio: number;
  /** Whether the device pixel ratio is supported*/
  supported: boolean;
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
 * const { supported, ratio } = useDevicePixelRatio();
 */
export const useDevicePixelRatio = (): UseDevicePixelRatioReturn => {
  const supported =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    typeof window.devicePixelRatio === 'number';

  const [ratio, setRatio] = useState(supported ? window.devicePixelRatio : 1);

  useEffect(() => {
    if (!supported) return;

    const onChange = () => setRatio(window.devicePixelRatio);

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [ratio]);

  return { supported, ratio };
};
