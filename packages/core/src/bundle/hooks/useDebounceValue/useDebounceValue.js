import { useEffect, useRef, useState } from 'react';
import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';
/**
 * @name useDebounceValue
 * @description - Hook that creates a debounced value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to be debounced
 * @param {number} delay The delay in milliseconds
 * @returns {Value} The debounced value
 *
 * @example
 * const debouncedValue = useDebounceValue(value, 500);
 */
export const useDebounceValue = (value, delay) => {
  const previousValueRef = useRef(value);
  const [debouncedValue, setDebounceValue] = useState(value);
  const debouncedSetState = useDebounceCallback(setDebounceValue, delay);
  useEffect(() => {
    if (previousValueRef.current === value) return;
    debouncedSetState(value);
    previousValueRef.current = value;
  }, [value]);
  return debouncedValue;
};
