import { useEffect, useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The use window size params type */
export interface UseWindowSizeOptions {
  /** Whether to include the scrollbar in the window size calculation */
  includeScrollbar?: boolean;
}

/** The use window size value type */
export interface UseWindowSizeValue {
  /** The current window height */
  height: number;
  /** The current window width */
  width: number;
}

/** The use window size return type */
export interface UseWindowSizeReturn {
  /** The latest window size snapshot */
  snapshot: UseWindowSizeValue;
  /** Function to enable subscriptions and rerender on next updates */
  watch: () => UseWindowSizeValue;
}

export type UseWindowSizeCallback = (value: UseWindowSizeValue, event: Event) => void;

export interface UseWindowSize {
  (callback?: UseWindowSizeCallback, options?: UseWindowSizeOptions): UseWindowSizeReturn;
  (options?: UseWindowSizeOptions): UseWindowSizeReturn;
}

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
export const useWindowSize = ((...params: any[]) => {
  const callback =
    typeof params[0] === 'function' ? (params[0] as UseWindowSizeCallback | undefined) : undefined;
  const options = (callback ? params[1] : params[0]) as UseWindowSizeOptions | undefined;
  const includeScrollbar = options?.includeScrollbar ?? true;

  const getSize = (): UseWindowSizeValue => {
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

  const snapshotRef = useRef<UseWindowSizeValue>(getSize());
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

    const onResize = (event: Event) => {
      updateValue();
      callbackRef.current?.(snapshotRef.current, event);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [includeScrollbar]);

  return { snapshot: snapshotRef.current, watch };
}) as UseWindowSize;
