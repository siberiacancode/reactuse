import { useRef, useState } from 'react';

import { useUnmount } from '../useUnmount/useUnmount';
/**
 * @name useRafValue
 * @description - Hook that returns the value and a function to set the value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} initialValue The initial value
 * @returns {UseRafValueReturn<Value>} An array containing the value and a function to set the value
 *
 * @example
 * const [value, setValue] = useRafValue(initialValue);
 */
export const useRafValue = (initialValue) => {
  const rafIdRef = useRef(0);
  const [value, setValue] = useState(initialValue);
  const set = (value) => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => setValue(value));
  };
  useUnmount(() => cancelAnimationFrame(rafIdRef.current));
  return [value, set];
};
