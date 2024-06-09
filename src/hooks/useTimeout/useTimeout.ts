import React from 'react';

import { useEvent } from '../useEvent/useEvent';

/** The use timeout return type */
interface UseTimeoutReturn {
  /**  Timeout is ready state value */
  ready: boolean;
  /** Function to clear timeout */
  clear: () => void;
}

/**
 * @name useTimeout
 * @description Hook that executes a callback function after a specified delay
 *
 * @param {() => void} callback The function to be executed after the timeout
 * @param {number} delay The delay in milliseconds before the timeout executes the callback function
 * @returns {UseTimeoutReturn} An object with a `ready` boolean state value and a `clear` function to clear timeout
 *
 * @example
 * const { clear, ready } = useTimeout(() => {}, 5000);
 */
export function useTimeout(callback: () => void, delay: number): UseTimeoutReturn {
  const [ready, setReady] = React.useState(false);

  const timeoutIdRef = React.useRef<ReturnType<typeof setTimeout>>();
  const internalCallback = useEvent(callback);

  React.useEffect(() => {
    timeoutIdRef.current = setTimeout(() => {
      internalCallback();
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [delay]);

  const clear = () => {
    clearTimeout(timeoutIdRef.current);
    setReady(true);
  };

  return { ready, clear };
}
