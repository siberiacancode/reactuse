import { useState } from 'react';
import { useInterval } from '../useInterval/useInterval';
/**
 * @name useMemory
 * @description - Hook that gives you current memory usage
 * @category Browser
 *
 * @browserapi performance.memory https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
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
    useInterval(() => setValue(performance.memory), 1000, { immediately: supported });
    return { supported, value };
};
