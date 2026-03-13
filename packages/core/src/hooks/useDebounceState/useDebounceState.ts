import { useState } from 'react';

import { useDebounceCallback } from '../useDebounceCallback/useDebounceCallback';

/**
 * @name useDebounceState
 * @description - Hook that creates a debounced state
 * @category Utilities
 * @usage high

 * @template Value The type of the value
 * @param {Value} value The value to be debounced
 * @param {number} delay The delay in milliseconds
 * @returns {[Value, (value: Value) => void]} The debounced state
 *
 * @example
 * const [debouncedValue, setDebouncedValue] = useDebounceState(value, 500);
 */
export const useDebounceState = <Value>(initialValue: Value, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const debouncedSetState = useDebounceCallback(setDebouncedValue, delay);

  return [debouncedValue, debouncedSetState] as const;
};
