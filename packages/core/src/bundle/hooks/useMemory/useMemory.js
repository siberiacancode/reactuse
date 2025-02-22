import { useState } from 'react';
import { useInterval } from '../useInterval/useInterval';
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
export const useMemory = () => {
    const supported = performance && 'memory' in performance;
    const [value, setValue] = useState({
        jsHeapSizeLimit: 0,
        totalJSHeapSize: 0,
        usedJSHeapSize: 0
    });
    useInterval(() => setValue(performance.memory), 1000, { enabled: supported });
    return { supported, value };
};
