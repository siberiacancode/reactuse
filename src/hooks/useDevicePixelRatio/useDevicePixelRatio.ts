import { useEffect, useState } from 'react';

export interface UseDevicePixelRatioReturn {
  /** The ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device. Equals to null if only `supported` = `false`. */
  ratio: number | null;
  /** Indicates if devicePixelRatio is available */
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
  const [ratio, setRatio] = useState<number | null>(null);

  const supported =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    typeof window.devicePixelRatio === 'number';

  useEffect(() => {
    if (!supported) return;

    const updatePixelRatio = () => setRatio(window.devicePixelRatio);

    updatePixelRatio();

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', updatePixelRatio);
    return () => media.removeEventListener('change', updatePixelRatio);
  }, [supported]);

  return { supported, ratio };
};
