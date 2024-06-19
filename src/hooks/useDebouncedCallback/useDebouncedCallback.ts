import { useMemo } from 'react';

import { debounce } from '@/utils/helpers';

/**
 * @name useDebouncedCallback
 * @description - Hook that creates a debounced callback and returns a stable reference of it
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with debounce
 *
 * @example
 * const debounced = useDebouncedCallback(() => console.log('callback'), 500);
 */
export const useDebounceCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
) => {
  const debounced = useMemo(() => debounce(callback, delay), [delay]);

  return debounced;
};
