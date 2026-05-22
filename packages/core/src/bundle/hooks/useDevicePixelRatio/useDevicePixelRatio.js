import { useEffect, useRef, useState } from 'react';
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
export const useDevicePixelRatio = (callback) => {
  const supported =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
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
