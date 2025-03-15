import { useRef } from 'react';
/**
 * @name useLockCallback
 * @description - Hook that prevents a callback from being executed multiple times simultaneously
 * @category Utilities
 *
 * @param {Function} callback The callback to be locked
 * @returns {Function} The locked callback
 *
 * @example
 * const lockedCallback = useLockCallback(() => promise());
 */
export const useLockCallback = (callback) => {
  const lockRef = useRef(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return async (...args) => {
    if (lockRef.current) return;
    lockRef.current = true;
    try {
      return await callbackRef.current(...args);
    } finally {
      lockRef.current = false;
    }
  };
};
