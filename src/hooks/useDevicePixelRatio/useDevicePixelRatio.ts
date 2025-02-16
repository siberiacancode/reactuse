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
 * @description - Hook that returns the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device
 * @category Display
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

  const [ratio, setRatio] = useState<number>(window.devicePixelRatio ?? 1);

  useEffect(() => {
    if (!supported) return;

    const updatePixelRatio = () => setRatio(window.devicePixelRatio);

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', updatePixelRatio);
    return () => {
      media.removeEventListener('change', updatePixelRatio);
    };
  }, [ratio]);

  return { supported, ratio };
};
