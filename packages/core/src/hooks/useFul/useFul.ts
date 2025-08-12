import { useEffect } from 'react';

/**
 * @name useFul
 * @description - Hook that can be so useful
 * @category Humor
 * @usage low
 *
 * @warning - This hook is a joke. Please do not use it in production code!
 *
 * @template Value The type of the value
 * @param {Value} [value] The value to be returned
 * @returns {Value} The value passed to the hook
 *
 * @example
 * const value = useFul(state);
 */
export const useFul = <Value>(value?: Value) => {
  useEffect(() => {
    console.warn("Warning: You forgot to delete the 'useFul' hook.");
  }, []);

  return value;
};
