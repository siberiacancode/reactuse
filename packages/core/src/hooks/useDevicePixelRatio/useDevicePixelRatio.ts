import { useEffect, useRef, useState } from 'react';

/** The use device pixel ratio callback type */
export type UseDevicePixelRatioCallback = (value: number) => void;

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
 * @param {(value: number) => void} [callback] The callback to execute when the device pixel ratio changes
 * @returns {UseDevicePixelRatioReturn} The ratio and supported flag
 *
 * @example
 * const { supported, value } = useDevicePixelRatio();
 */
export const useDevicePixelRatio = (
  callback?: UseDevicePixelRatioCallback
): UseDevicePixelRatioReturn => {
  const supported =
    typeof window !== 'undefined' &&
    'matchMedia' in window &&
    !!window.matchMedia &&
    'devicePixelRatio' in window &&
    typeof window.devicePixelRatio === 'number';

  const [value, setValue] = useState(supported ? window.devicePixelRatio : 1);

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!supported) return;

    const onChange = () => {
      const nextValue = window.devicePixelRatio;
      setValue(nextValue);
      internalCallbackRef.current?.(nextValue);
    };

    const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [supported, value]);

  return { supported, value };
};
