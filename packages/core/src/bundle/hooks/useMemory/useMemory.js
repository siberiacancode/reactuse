import { useEffect, useState } from 'react';
/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 * @usage low
 *
 * @browserapi performance.memory https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 *
 * @returns {UseMemoryReturn} An object containing the current memory usage
 *
 * @example
 * const { supported, value } = useMemory();
 */
export const useMemory = () => {
  const supported = performance && 'memory' in performance && !!performance.memory;
  const [value, setValue] = useState(
    performance?.memory ?? {
      jsHeapSizeLimit: 0,
      totalJSHeapSize: 0,
      usedJSHeapSize: 0
    }
  );
  useEffect(() => {
    if (!supported) return;
    const intervalId = setInterval(() => setValue(performance.memory), 1000);
    return () => clearInterval(intervalId);
  }, []);
  return { supported, value };
};
