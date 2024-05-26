import React from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

/** The use timeout return type */
interface UseTimeoutReturn {
  /**  Timeout is ready state value */
  ready: boolean;
  /** Function to clear timeout */
  clear: () => void;
}

/**
 * @name useTimeout
 * @description Hook that executes a callback function after a specified delay.
 *
 * @param {() => void} callback The function to be executed after the timeout.
 * @param {number} delay The delay in milliseconds before the timeout executes the callback function.
 * @returns {UseTimeoutReturn} An object with a `ready` boolean state value and a `clear` function to clear timeout.
 *
 * @example
 * const { clear, ready } = useTimeout(() => {}, 5000)
 */
export function useTimeout(callback: () => void, delay: number): UseTimeoutReturn {
  const [ready, setReady] = React.useState(false);
  const internalCallbackRef = React.useRef(callback);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  useIsomorphicLayoutEffect(() => {
    internalCallbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      internalCallbackRef.current();
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  const clear = () => {
    clearTimeout(timeoutRef.current);
    setReady(true);
  };

  return { ready, clear };
}
