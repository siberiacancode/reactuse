import { useRef } from 'react';
/**
 * @name useLatest
 * @description - Hook that returns the stable reference of the value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @returns {Value} The previous value
 *
 * @example
 * const latestValue = useLatest(value);
 */
export const useLatest = (value) => {
  const valueRef = useRef(value);
  valueRef.current = value;
  return valueRef.current;
};
