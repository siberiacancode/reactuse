import { useMemo, useRef } from 'react';
/**
 * @name useThrottleCallback
 * @description - Hook that creates a throttled callback
 * @category Utilities
 * @usage medium
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
  const lastArgsRef = useRef(null);
  const prevArgsRef = useRef(null);
  const timeoutRef = useRef(null);
  const internalCallbackRef = useRef(callback);
  const delayRef = useRef(delay);
  internalCallbackRef.current = callback;
  delayRef.current = delay;
  const throttled = useMemo(() => {
    const cancel = () => {
      if (!timeoutRef.current) return;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      prevArgsRef.current = null;
    };
    const throttledCallback = function (...args) {
      lastArgsRef.current = args;
      if (timeoutRef.current) return;
      prevArgsRef.current = args;
      internalCallbackRef.current.apply(this, args);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        if (!lastArgsRef.current) return;
        if (prevArgsRef.current === lastArgsRef.current) return;
        internalCallbackRef.current.apply(this, lastArgsRef.current);
      }, delayRef.current);
    };
    throttledCallback.cancel = cancel;
    cancel();
    return throttledCallback;
  }, [delay]);
  return throttled;
};
