import { useState } from 'react';

import { useInterval } from '../useInterval/useInterval';

declare global {
  interface Performance {
    memory: {
      readonly jsHeapSizeLimit: number;
      readonly totalJSHeapSize: number;
      readonly usedJSHeapSize: number;
    };
  }
}

/** The use memory return type */
export interface UseMemoryReturn {
  /** The memory supported status */
  supported: boolean;
  /** The current memory usage */
  value: Performance['memory'];
}

/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 *
 * @returns {UseMemoryReturn} An object containing the current memory usage
 *
 * @example
 * const { supported, value } = useMemory();
 */
export const useMemory = (): UseMemoryReturn => {
  const supported = performance && 'memory' in performance;
  const [value, setValue] = useState<Performance['memory']>({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0
  });

  useInterval(() => setValue(performance.memory), 1000, { enabled: supported });

  return { supported, value };
};
