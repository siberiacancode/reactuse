import { useMemo } from 'react';

import { throttle } from '@/utils/helpers';

import { useEvent } from '../useEvent/useEvent';

/**
 * @name useThrottleCallback
 * @description - Hook that creates a throttled callback and returns a stable reference of it
 * @category Utilities
 *
 * @template Params The type of the params
 * @template Return The type of the return
 * @param {(...args: Params) => Return} callback The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {(...args: Params) => Return} The callback with throttle
 *
 * @example
 * const throttled = useThrottleCallback(() => console.log('callback'), 500);
 */
export const useThrottleCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
) => {
  const internalCallback = useEvent(callback);
  const throttled = useMemo(() => throttle(internalCallback, delay), [delay]);

  return throttled;
};
