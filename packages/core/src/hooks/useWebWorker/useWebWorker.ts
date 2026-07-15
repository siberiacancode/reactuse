import { useEffect, useRef, useState } from 'react';

/** The source used to create or connect to a web worker */
export type UseWebWorkerSource = string | URL | Worker;

/** The use web worker return type */
export interface UseWebWorkerReturn<Data = unknown> {
  /** The most recently received data from the worker */
  data?: Data;
  /** The most recently received worker error */
  error?: Event;
  /** Function to send data to the worker */
  post: Worker['postMessage'];
  /** Function to stop the worker */
  terminate: () => void;
}

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
export const useWebWorker = <Data>(
  source: UseWebWorkerSource,
  options?: WorkerOptions
): UseWebWorkerReturn<Data> => {
  const [data, setData] = useState<Data>();
  const [error, setError] = useState<Event>();

  const workerRef = useRef<Worker>(undefined);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const post = (...args: any[]) => {
    const worker = workerRef.current;
    if (!worker) return;

    worker.postMessage(...(args as Parameters<Worker['postMessage']>));
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

    const onMessage = (event: MessageEvent<Data>) => setData(event.data);
    const onError = (event: Event) => setError(event);

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
