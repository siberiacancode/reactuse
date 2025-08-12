import { useEffect, useRef, useState } from 'react';
/**
 * @name usePerformanceObserver
 * @description - Hook that allows you to observe performance entries
 * @category Sensors
 * @usage low
 *
 * @browserapi PerformanceObserver https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
 *
 * @param {UsePerformanceObserverOptions} options The options for the performance observer
 * @param {PerformanceObserverCallback} callback The function to handle performance entries
 * @returns {object} An object containing the observer's support status and methods to start and stop the observer
 *
 * @example
 * const { supported, entries, start, stop } = usePerformanceObserver();
 */
export const usePerformanceObserver = (options, callback) => {
  const supported = typeof window !== 'undefined' && typeof PerformanceObserver !== 'undefined';
  const [entries, setEntries] = useState([]);
  const observerRef = useRef(null);
  const internalCallback = useRef(callback);
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
