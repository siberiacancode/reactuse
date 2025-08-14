import { useEffect } from 'react';

import { useDebounceCallback } from '../utilities';

/**
 * @name useDebounceEffect
 * @description - Hook that runs an effect function with a debounce delay
 * @category Utilities
 *
 * @template Params The type of the parameters passed to the effect
 * @param {() => void | Promise<void>} effect The effect function to execute with debounce
 * @param {React.DependencyList} dependency The dependency array for the effect
 * @param {number} delay The debounce delay in milliseconds before running the effect
 * @returns {void}
 *
 * @example
 * useDebounceEffect(() => {
 *   console.log("Effect called with delay");
 * }, [value], 500);
 */
export const useDebounceEffect = (
  effect: () => Promise<void> | void,
  dependency: React.DependencyList,
  delay: number
) => {
  const debouncedCallback = useDebounceCallback(effect, delay);

  useEffect(() => {
    debouncedCallback();
  }, [debouncedCallback, ...dependency]);
};
