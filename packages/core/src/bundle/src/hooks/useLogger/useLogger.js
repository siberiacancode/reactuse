import { useEffect } from 'react';
import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
/**
 * @name useLogger
 * @description - Hook for debugging lifecycle
 * @category Debug
 * @usage low
 *
 * @param {string} name The name or identifier for the logger
 * @param {unknown[]} params Additional arguments to be logged
 *
 * @example
 * useLogger('Component', [1, 2, 3]);
 */
export const useLogger = (name, params) => {
  useEffect(() => {
    console.log(`${name} mounted`, ...params);
    return () => console.log(`${name} unmounted`);
  }, []);
  useDidUpdate(() => {
    console.log(`${name} updated`, ...params);
  }, params);
};
