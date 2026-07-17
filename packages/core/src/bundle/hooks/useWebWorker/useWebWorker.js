import { useEffect, useRef, useState } from 'react';
/**
 * @name useWebWorker
 * @description - Hook that provides a reactive wrapper for a web worker
 * @category Browser
 * @usage low
 *
 * @browserapi Worker https://developer.mozilla.org/en-US/docs/Web/API/Worker
 *
 * @param {UseWebWorkerSource} source The worker script URL or an existing Worker instance. Passing a Worker instance transfers its ownership to the hook, so it is terminated on unmount
 * @param {WorkerOptions['name']} [options.name] The name of the worker
 * @param {WorkerOptions['type']} [options.type] The type of the worker
 * @param {WorkerOptions['credentials']} [options.credentials] The credentials of the worker
 * @param {(data: Data, event: MessageEvent<Data>) => void} [options.onMessage] The callback to execute when a message is received from the worker
 * @param {(event: Event) => void} [options.onError] The callback to execute when the worker fails
 * @returns {UseWebWorkerReturn<Data>} The latest worker state and controls
 *
 * @example
 * const { data, error, terminated, post, restart, terminate } = useWebWorker<number>('/worker.js');
 */
export const useWebWorker = (source, options) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [terminated, setTerminated] = useState(false);
  const [version, setVersion] = useState(0);
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
    setTerminated(true);
  };
  const restart = () => setVersion((currentVersion) => currentVersion + 1);
  useEffect(() => {
    setData(undefined);
    setError(undefined);
    setTerminated(false);
    const worker =
      source instanceof Worker
        ? source
        : new Worker(source, {
            credentials: optionsRef.current?.credentials,
            name: optionsRef.current?.name,
            type: optionsRef.current?.type
          });
    workerRef.current = worker;
    const onMessage = (event) => {
      setData(event.data);
      optionsRef.current?.onMessage?.(event.data, event);
    };
    const onError = (event) => {
      setError(event);
      optionsRef.current?.onError?.(event);
    };
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
  }, [source, options?.credentials, options?.name, options?.type, version]);
  return { data, error, terminated, post, restart, terminate };
};
