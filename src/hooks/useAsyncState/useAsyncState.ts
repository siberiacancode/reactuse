import { useEffect, useRef, useState } from 'react';

function noop() {}

function sleep(ms: number, abortController: AbortController): Promise<void> {
  return new Promise((resolve, reject) => {
    abortController.signal.addEventListener('abort', () => {
      reject(abortController.signal.reason);
    });

    setTimeout(resolve, ms);
  });
}

export interface UseAsyncStateOptions<Data> {
  /** Delay in milliseconds */
  delay?: number;
  /** Execute immediately */
  immediate?: boolean;
  /** Reset date on execute */
  resetOnExecute?: boolean;
  /** Error callback */
  onError?: (error: unknown) => void;
  /** Success callback */
  onSuccess?: (data: Data) => void;
}

export interface UseAsyncStateReturn<Data, Params extends any[]> {
  /** The current data */
  data: Data;
  /** The current error */
  error: unknown;
  /** Whether the state is loading */
  isLoading: boolean;
  /** Cancel the promise */
  cancel: (error?: Error) => void;
  /** Execute the promise */
  execute: (...params: Params) => Promise<Data>;
}

/**
 * @name useAsyncState
 * @description - Hook that manages an asynchronous state
 * @category Browser
 *
 * @overload
 * @param {Promise<Data> | ((...args: Params) => Promise<Data>)} promise The promise or function that returns a promise
 * @param {Data} initialData The initial data value
 * @param {UseAsyncStateOptions<Data>?} [options={ imediate: false, resetOnExecute: false, delay: 0 }] Optional options for the async state
 * @return {UseAsyncStateReturn<Data, Params>} An object containing the current state and functions to interact with the state
 *
 * @example
 * const { data, error, isLoading, execute } = useAsyncState(promiseFn, null, { immediate: false, delay: 1000 });
 */
export const useAsyncState = <Data, Params extends any[] = []>(
  promise: Promise<Data> | ((signal: AbortSignal, ...args: Params) => Promise<Data>),
  initialData: Data,
  options?: UseAsyncStateOptions<Data>
): UseAsyncStateReturn<Data, Params> => {
  const {
    resetOnExecute = false,
    immediate = false,
    delay = 0,
    onError = noop,
    onSuccess = noop
  } = options ?? {};

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const abortController = useRef<AbortController | null>(null);

  function cancel(reason = new Error('canceled due to new execution')) {
    if (abortController.current) {
      abortController.current.abort(reason);
    }
  }

  async function execute(...args: any[]) {
    cancel();

    setIsLoading(true);
    setError(undefined);
    if (resetOnExecute) {
      setData(initialData);
    }

    abortController.current = new AbortController();
    const promiseTask =
      typeof promise === 'function'
        ? promise(abortController.current.signal, ...(args as Params))
        : promise;

    try {
      if (delay > 0) {
        await sleep(delay, abortController.current);
      }

      const data = await promiseTask;
      setData(data);
      onSuccess(data);
    } catch (err) {
      setError(err);
      onError(err);
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }

    return data;
  }

  useEffect(() => {
    if (!isLoading && immediate) execute();
  }, [immediate]);

  return {
    data,
    error,
    isLoading,
    cancel,
    execute
  };
};
