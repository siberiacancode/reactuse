import { useEffect, useRef, useState } from 'react';

/** The use performance observer options type */
export type UsePerformanceObserverOptions = PerformanceObserverInit & {
  /** Whether to start the observer immediately */
  immediate?: boolean;
};

/**
 * @name usePerformanceObserver
 * @description - Hook that allows you to observe performance entries
 * @category Sensor
 *
 * @param {UsePerformanceObserverOptions} options The options for the performance observer
 * @param {PerformanceObserverCallback} callback The function to handle performance entries
 * @returns {object} An object containing the observer's support status and methods to start and stop the observer
 *
 * @example
 * const { supported, entries, start, stop } = usePerformanceObserver();
 */
export const usePerformanceObserver = (
  options: UsePerformanceObserverOptions,
  callback?: PerformanceObserverCallback
) => {
  const supported = typeof window !== 'undefined' && typeof PerformanceObserver !== 'undefined';
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  const observerRef = useRef<PerformanceObserver | null>(null);
  const internalCallback = useRef<PerformanceObserverCallback | null>();
  internalCallback.current = callback;

  const start = () => {
    if (!supported) return;
    const observer = new PerformanceObserver((entryList, observer) => {
      setEntries(entryList.getEntries());
      internalCallback.current?.(entryList, observer);
    });
    observer.observe(options);
    observerRef.current = observer;
  };

  const stop = () => {
    if (!supported) return;
    observerRef.current?.disconnect();
    observerRef.current = null;
  };

  useEffect(() => {
    if (!supported) return;
    if (options.immediate) start();

    return () => {
      stop();
    };
  }, []);

  return { supported, entries, start, stop };
};
