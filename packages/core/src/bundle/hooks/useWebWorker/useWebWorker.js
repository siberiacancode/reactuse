import { useEffect, useRef, useState } from 'react';
/**
 * @name useWebWorker
 * @description - Hook that provides a reactive wrapper for a web worker
 * @category Browser
 * @usage low
 *
 * @browserapi Worker https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * @param {UseWebWorkerSource} source The worker script URL or an existing Worker instance
 * @param {WorkerOptions} [options] Options used when creating a worker from a URL
 * @returns {UseWebWorkerReturn<Data>} The latest worker state and controls
 *
 * @note Passing a Worker instance transfers its ownership to the hook. The worker is terminated on unmount.
 *
 * @example
 * const { data, error, post, terminate } = useWebWorker<number>('/worker.js');
 */
export const useWebWorker = (source, options) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const workerRef = useRef(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const post = (...args) => {
    const worker = workerRef.current;
    if (!worker) return;
    worker.postMessage(...args);
  };
  const terminate = () => {
    const worker = workerRef.current;
    if (!worker) return;
    workerRef.current = undefined;
    worker.terminate();
  };
  const optionCredentials = options?.credentials;
  const optionName = options?.name;
  const optionType = options?.type;
  useEffect(() => {
    if (typeof Worker === 'undefined') return;
    setData(undefined);
    setError(undefined);
    const worker = source instanceof Worker ? source : new Worker(source, optionsRef.current);
    workerRef.current = worker;
    const onMessage = (event) => setData(event.data);
    const onError = (event) => setError(event);
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.addEventListener('messageerror', onError);
    return () => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      worker.removeEventListener('messageerror', onError);
      if (workerRef.current !== worker) return;
      workerRef.current = undefined;
      worker.terminate();
    };
  }, [source, optionCredentials, optionName, optionType]);
  return { data, error, post, terminate };
};
