import React from 'react';

import { debounce } from '@/utils/helpers';

// делаем value и state
// усложняем ли хуки value и state

interface UseDebouncedValueOptions {
  /** The maximum time the debounce function will wait before being invoked */
  maxWait?: number;
}

export type UseDocumentTitleReturn<Value> = [
  /** The debounced state value */
  state: Value,

  /** Function to update the state value */
  debouncedSetState: (value: Value) => void
];

/**
 * @name useDebouncedValue
 * @description - Hook that returns a debounced value and a function to update it
 *
 * @param {Value} value - The value to be debounced
 * @param {number} delay - The delay in milliseconds for debouncing
 * @param {UseDebouncedValueOptions} [options] - Optional configurations for debouncing
 * @returns {UseDocumentTitleReturn} - Returns the debounced value and a function to update the state
 *
 * @example
 * const [debouncedValue, setDebouncedValue] = useDebouncedValue(value, 300);
 */
export const useDebouncedValue = <Value>(
  value: Value,
  delay: number,
  options?: UseDebouncedValueOptions
): UseDocumentTitleReturn<Value> => {
  console.log('@', options);
  const previousValueRef = React.useRef(value);
  const [state, setState] = React.useState(value);

  const debouncedSetState = React.useMemo(
    () => debounce((value: Value) => setState(value), delay),
    [delay]
  );

  React.useEffect(() => {
    if (previousValueRef.current === value) return;
    debouncedSetState(value);
    previousValueRef.current = value;
  }, [value]);

  return [state, debouncedSetState] as const;
};
