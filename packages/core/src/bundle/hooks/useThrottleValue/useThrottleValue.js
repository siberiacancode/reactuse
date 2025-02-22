import { useEffect, useRef, useState } from 'react';

import { useThrottleCallback } from '../useThrottleCallback/useThrottleCallback';
/**
 * @name useThrottleValue
 * @description - Hook that creates a throttled value and returns a stable reference of it
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to be throttled
 * @param {number} delay The delay in milliseconds
 * @returns {Value} The throttled value
 *
 * @example
 * const throttledValue = useThrottleValue(value, 500);
 */
export const useThrottleValue = (value, delay) => {
  const previousValueRef = useRef(value);
  const [throttledValue, setThrottleValue] = useState(value);
  const throttledSetState = useThrottleCallback(setThrottleValue, delay);
  useEffect(() => {
    if (previousValueRef.current === value) return;
    throttledSetState(value);
    previousValueRef.current = value;
  }, [value]);
  return throttledValue;
};
