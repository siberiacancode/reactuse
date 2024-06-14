import { useCallback, useRef } from 'react';

/**
 * @name useLockFn
 * @description A hook that creates a function which ensures that only one instance of the given asynchronous function can run at a time.
 *
 * @template P - The parameters type of the function.
 * @template V - The return type of the function.
 * @param {(...args: P) => Promise<V>} fn - The asynchronous function to be locked.
 * @returns {(...args: P) => Promise<V | undefined>} A function that ensures only one instance of the given function can run at a time.
 *
 * @example
 * const lockedFunction = useLockFn(asyncFunction);
 * lockedFunction(arg1, arg2).then(result => {
 *   console.log(result);
 * }).catch(error => {
 *   console.error(error);
 * });
 */

export const useLockFn = <P extends any[] = [], V = void>(fn: (...args: P) => Promise<V>) => {
  const lockRef = useRef<boolean>(false);

  return useCallback(
    async (...args: P): Promise<V | undefined> => {
      if (lockRef.current) return;
      lockRef.current = true;
      try {
        return await fn(...args);
      } finally {
        lockRef.current = false;
      }
    },
    [fn]
  );
};
