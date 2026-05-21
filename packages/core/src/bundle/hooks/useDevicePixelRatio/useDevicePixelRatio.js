import { useEffect, useState } from 'react';
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
export const useDevicePixelRatio = () => {
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
