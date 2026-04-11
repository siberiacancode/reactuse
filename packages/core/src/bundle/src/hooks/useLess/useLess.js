import { useEffect } from 'react';
/**
 * @name useLess
 * @description - Hook that can be so useless
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
 * const value = useLess(state);
 */
export const useLess = (value) => {
  useEffect(() => {
    console.warn("Warning: You forgot to delete the 'useLess' hook.");
  }, []);
  return value;
};
