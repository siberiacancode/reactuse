import { useEffect, useRef, useState } from 'react';
/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 * @usage low
 *
 * @browserapi performance.memory https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 *
 * @param {(value: Performance['memory']) => void} [callback] The callback to execute when the memory usage changes
 * @returns {UseMemoryReturn} An object containing the current memory usage
 *
 * @example
 * const { supported, value } = useMemory();
 *
 * @example
 * const { value } = useMemory((nextValue) => {
 *   console.log(nextValue.usedJSHeapSize);
 * });
 */
export const useMemory = (callback) => {
  const supported =
    typeof performance !== 'undefined' && 'memory' in performance && !!performance.memory;
  const [value, setValue] = useState(
    supported
      ? performance.memory
      : {
          jsHeapSizeLimit: 0,
          totalJSHeapSize: 0,
          usedJSHeapSize: 0
        }
  );
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (!supported) return;
    const intervalId = setInterval(() => {
      const nextValue = performance.memory;
      setValue(nextValue);
      callbackRef.current?.(nextValue);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [supported]);
  return { supported, value };
};
