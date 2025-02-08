import { useCallback, useRef } from 'react';

/**
 * @name useEvent
 * @description - Hook that creates an event and returns a stable reference of it
 * @category Browser
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @returns {(...args: Params) => Return} The callback
 *
 * @example
 * const onClick = useEvent(() => console.log('clicked'));
 */
export const useEvent = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return
): ((...args: Params) => Return) => {
  const callbackRef = useRef<typeof callback>(callback);
  callbackRef.current = callback;

  return useCallback((...args) => {
    const fn = callbackRef.current;
    return fn(...args);
  }, []);
};
