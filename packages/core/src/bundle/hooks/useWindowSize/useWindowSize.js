import { useEffect, useRef } from 'react';
import { useRerender } from '../useRerender/useRerender';
/**
 * @name useWindowSize
 * @description - Hook that manages a window size
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {(value: UseWindowSizeValue, event: Event) => void} [callback] The callback to invoke on window size updates
 * @param {boolean} [options.includeScrollbar=true] Whether to include the scrollbar in the window size calculation
 * @returns {UseWindowSizeReturn} An object containing the latest window size snapshot and watch function
 *
 * @example
 * const { snapshot, watch } = useWindowSize((value) => console.log(value));
 *
 * @overload
 * @param {boolean} [options.includeScrollbar=true] Whether to include the scrollbar in the window size calculation
 * @returns {UseWindowSizeReturn} An object containing the latest window size snapshot and watch function
 *
 * @example
 * const { snapshot, watch } = useWindowSize();
 */
export const useWindowSize = (...params) => {
  const callback = typeof params[0] === 'function' ? params[0] : undefined;
  const options = callback ? params[1] : params[0];
  const includeScrollbar = options?.includeScrollbar ?? true;
  const getSize = () => {
    if (typeof window === 'undefined') {
      return {
        width: Number.POSITIVE_INFINITY,
        height: Number.POSITIVE_INFINITY
      };
    }
    return {
      width: includeScrollbar ? window.innerWidth : window.document.documentElement.clientWidth,
      height: includeScrollbar ? window.innerHeight : window.document.documentElement.clientHeight
    };
  };
  const snapshotRef = useRef(getSize());
  const callbackRef = useRef(callback);
  const watchingRef = useRef(false);
  const rerender = useRerender();
  callbackRef.current = callback;
  const watch = () => {
    watchingRef.current = true;
    return snapshotRef.current;
  };
  useEffect(() => {
    const updateValue = () => {
      snapshotRef.current = getSize();
      if (watchingRef.current) rerender();
    };
    updateValue();
    if (typeof window === 'undefined') return;
    const onResize = (event) => {
      updateValue();
      callbackRef.current?.(snapshotRef.current, event);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [includeScrollbar]);
  return { snapshot: snapshotRef.current, watch };
};
