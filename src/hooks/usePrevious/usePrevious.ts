import { useState } from 'react';

/**
 * @name usePrevious
 * @description - Hook that returns the previous value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @returns {Value} The previous value
 *
 * @example
 * const prevValue = usePrevious(value);
 */
export const usePrevious = <Value>(value: Value) => {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<Value>();

  if (value !== current) {
    setCurrent(value);
    setPrevious(current);
  }

  return previous;
};
