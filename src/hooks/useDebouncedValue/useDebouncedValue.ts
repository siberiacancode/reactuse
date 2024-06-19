import { useEffect, useRef, useState } from 'react';

import { useDebounceCallback } from '../useDebouncedCallback/useDebouncedCallback';

/**
 * @name useDebouncedValue
 * @description - Hook that creates a debounced value and returns a stable reference of it
 *
 * @template Value The type of the value
 * @param {Value} value The value to be debounced
 * @param {number} delay The delay in milliseconds
 * @returns {Value} The debounced value
 *
 * @example
 * const debouncedValue = useDebouncedValue(value, 500);
 */
export const useDebouncedValue = <Value>(value: Value, delay: number) => {
  const previousValueRef = useRef(value);
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetState = useDebounceCallback(setDebouncedValue, delay);

  useEffect(() => {
    if (previousValueRef.current === value) return;
    debouncedSetState(value);
    previousValueRef.current = value;
  }, [value]);

  return debouncedValue;
};
