import React from 'react';

import { debounce } from '@/utils/helpers';

// делаем value и state
// усложняем ли хуки value и state

interface UseDebouncedValueOptions {
  maxWait?: number;
}

/**
 * @name useDebouncedValue
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 *
 * @param {any} value fix me
 * @param {number} delay The delay in milliseconds
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 */
export const useDebouncedValue = <Value>(
  value: Value,
  delay: number,
  options?: UseDebouncedValueOptions
) => {
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
