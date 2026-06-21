import { useEffect, useRef } from 'react';
import { useRerender } from '../useRerender/useRerender';
export const scrollTo = ({ x, y, behavior = 'smooth' }) => {
  const scrollOptions = { behavior };
  if (typeof x === 'number') scrollOptions.left = x;
  if (typeof y === 'number') scrollOptions.top = y;
  window.scrollTo(scrollOptions);
};
/**
 * @name useWindowScroll
 * @description - Hook that manages the window scroll position
 * @category Sensors
 * @usage low
 *
 * @param {(value: ScrollPosition, event: Event) => void} [callback] The callback to invoke on window scroll updates
 * @returns {UseWindowScrollReturn} An object containing the latest window scroll snapshot, watch function, and scrollTo helper
 *
 * @example
 * const { snapshot, scrollTo, watch } = useWindowScroll((value) => console.log(value));
 */
export const useWindowScroll = (callback) => {
  const getValue = () => {
    if (typeof window === 'undefined')
      return { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY };
    return { x: window.scrollX, y: window.scrollY };
  };
  const snapshotRef = useRef(getValue());
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
      snapshotRef.current = getValue();
      if (watchingRef.current) rerender();
    };
    const onChange = (event) => {
      updateValue();
      callbackRef.current?.(snapshotRef.current, event);
    };
    updateValue();
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', onChange);
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);
  return { snapshot: snapshotRef.current, scrollTo, watch };
};
