import { useState } from 'react';
import { useThrottleCallback } from '../useThrottleCallback/useThrottleCallback';
/**
 * @name useThrottleState
 * @description - Hook that creates a throttled state
 * @category Utilities
 * @usage medium
 *
 * @template Value The type of the value
 * @param {Value} value The value to be throttled
 * @param {number} delay The delay in milliseconds
 * @returns {[Value, (value: Value) => void]} The throttled state
 *
 * @example
 * const [throttledValue, setThrottledValue] = useThrottleState(value, 500);
 */
export const useThrottleState = (initialValue, delay) => {
  const [throttledValue, setThrottledValue] = useState(initialValue);
  const throttledSetState = useThrottleCallback(setThrottledValue, delay);
  return [throttledValue, throttledSetState];
};
