import { useMemo, useRef } from 'react';
/**
 * @name useThrottleCallback
 * @description - Hook that creates a throttled callback
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
export const useThrottleCallback = (callback, delay) => {
  const internalCallbackRef = useRef(callback);
  const timeoutRef = useRef(null);
  const isCalledRef = useRef(false);
  const delayRef = useRef(delay);
  const lastArgsRef = useRef(null);
  internalCallbackRef.current = callback;
  delayRef.current = delay;
  const throttled = useMemo(() => {
    const timer = () => {
      isCalledRef.current = false;
      if (!lastArgsRef.current) return;
      internalCallbackRef.current.apply(this, lastArgsRef.current);
      lastArgsRef.current = null;
      setTimeout(timer, delayRef.current);
    };
    const cancel = () => {
      if (!timeoutRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      isCalledRef.current = false;
    };
    const throttledCallback = function (...args) {
      lastArgsRef.current = args;
      if (isCalledRef.current) return;
      internalCallbackRef.current.apply(this, args);
      isCalledRef.current = true;
      timeoutRef.current = setTimeout(timer, delayRef.current);
    };
    throttledCallback.cancel = cancel;
    console.log('cancel', timeoutRef.current);
    cancel();
    return throttledCallback;
  }, [delay]);
  return throttled;
};
