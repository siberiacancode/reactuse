import { useCallback, useEffect, useRef, useState } from 'react';

/** The use web worker callback status type */
export type UseWebWorkerCallbackStatus = 'error' | 'idle' | 'running' | 'success';

/** The use web worker callback return type */
export interface UseWebWorkerCallbackReturn<Callback extends (...args: any[]) => any> {
  /** The current worker status */
  status: UseWebWorkerCallbackStatus;
  /** Run the callback in a web worker */
  callback: (...args: Parameters<Callback>) => Promise<Awaited<ReturnType<Callback>>>;
  /** Terminate the active worker and reset the status */
  terminate: () => void;
}

interface SerializedWorkerError {
  message: string;
  name: string;
  stack?: string;
}

type WorkerResponse<Result> =
  | { error: SerializedWorkerError; status: 'error' }
  | { result: Result; status: 'success' };

const createAbortError = () => {
  const error = new Error('The web worker was terminated.');
  error.name = 'AbortError';
  return error;
};

const createError = (value: unknown) => {
  if (value instanceof Error) return value;
  return new Error(typeof value === 'string' ? value : 'The web worker failed.');
};

const createWorkerError = (value?: SerializedWorkerError) => {
  const error = new Error(value?.message ?? 'The web worker failed.');
  error.name = value?.name ?? 'Error';
  if (value?.stack) error.stack = value.stack;
  return error;
};

const createWorkerSource = (callback: string) => `
const callback = (${callback});

const serializeError = (error) => ({
  message: error instanceof Error ? error.message : String(error),
  name: error instanceof Error ? error.name : 'Error',
  stack: error instanceof Error ? error.stack : undefined
});

self.onmessage = async (event) => {
  try {
    const result = await callback(...event.data);
    self.postMessage({ status: 'success', result });
  } catch (error) {
    self.postMessage({ status: 'error', error: serializeError(error) });
  }
};
`;

/**
 * @name useWebWorkerCallback
 * @description - Hook that runs a callback in a web worker without a separate worker file
 * @category Browser
 * @usage medium
 *
 * @browserapi Web Workers https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
 *
 * @template Callback The callback type
 * @param {Function} callback The self-contained callback to run in a web worker; closures are not available and its arguments and result must be structured-cloneable
 * @returns {UseWebWorkerCallbackReturn} An object with the callback, status, and terminate function
 *
 * @example
 * const { callback, status, terminate } = useWebWorkerCallback((numbers: number[]) => numbers.sort((a, b) => a - b));
 */
export const useWebWorkerCallback = <Callback extends (...args: any[]) => any>(
  callback: Callback
): UseWebWorkerCallbackReturn<Callback> => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const workerRef = useRef<Worker>(undefined);
  const objectUrlRef = useRef<string>(undefined);
  const rejectRef = useRef<((reason?: unknown) => void) | undefined>(undefined);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<UseWebWorkerCallbackStatus>('idle');

  const cleanup = useCallback(() => {
    const worker = workerRef.current;
    workerRef.current = undefined;

    if (worker) {
      worker.onmessage = null;
      worker.onmessageerror = null;
      worker.onerror = null;
      worker.terminate();
    }

    const objectUrl = objectUrlRef.current;
    objectUrlRef.current = undefined;
    if (objectUrl && typeof URL !== 'undefined') URL.revokeObjectURL(objectUrl);

    rejectRef.current = undefined;
  }, []);

  const terminateWorker = useCallback(
    (updateStatus: boolean) => {
      const reject = rejectRef.current;
      const running = !!workerRef.current;
      cleanup();
      if (running) reject?.(createAbortError());
      if (updateStatus && mountedRef.current) setStatus('idle');
    },
    [cleanup]
  );

  const terminate = useCallback(() => terminateWorker(true), [terminateWorker]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      terminateWorker(false);
    };
  }, [terminateWorker]);

  const run = useCallback(
    (...args: Parameters<Callback>): Promise<Awaited<ReturnType<Callback>>> => {
      if (workerRef.current)
        return Promise.reject(new Error('The web worker callback is already running.'));

      if (
        typeof Worker === 'undefined' ||
        typeof Blob === 'undefined' ||
        typeof URL === 'undefined' ||
        typeof URL.createObjectURL !== 'function' ||
        typeof URL.revokeObjectURL !== 'function'
      ) {
        const error = new Error('Web workers are not supported in this environment.');
        setStatus('error');
        return Promise.reject(error);
      }

      return new Promise<Awaited<ReturnType<Callback>>>((resolve, reject) => {
        try {
          const source = createWorkerSource(callbackRef.current.toString());
          const blob = new Blob([source], { type: 'text/javascript' });
          const objectUrl = URL.createObjectURL(blob);
          objectUrlRef.current = objectUrl;
          const worker = new Worker(objectUrl);

          workerRef.current = worker;
          rejectRef.current = reject;
          setStatus('running');

          worker.onmessage = (
            event: MessageEvent<WorkerResponse<Awaited<ReturnType<Callback>>>>
          ) => {
            if (workerRef.current !== worker) return;

            const response = event.data;
            cleanup();

            if (response?.status === 'success') {
              if (mountedRef.current) setStatus('success');
              resolve(response.result);
              return;
            }

            if (mountedRef.current) setStatus('error');
            reject(createWorkerError(response?.status === 'error' ? response.error : undefined));
          };

          worker.onmessageerror = () => {
            if (workerRef.current !== worker) return;
            cleanup();
            if (mountedRef.current) setStatus('error');
            reject(new Error('The web worker returned an unreadable message.'));
          };

          worker.onerror = (event) => {
            if (workerRef.current !== worker) return;
            event.preventDefault();
            cleanup();
            if (mountedRef.current) setStatus('error');
            reject(createError(event.error ?? event.message));
          };

          worker.postMessage(args);
        } catch (error) {
          cleanup();
          if (mountedRef.current) setStatus('error');
          reject(createError(error));
        }
      });
    },
    [cleanup]
  );

  return { callback: run, status, terminate };
};
