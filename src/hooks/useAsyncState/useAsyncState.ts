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

function cancelablePromiseFn<T>(
  promiseFn: (signal: AbortSignal, ...args: any[]) => Promise<T>,
  delay: number
) {
  const abortController = new AbortController();

  return {
    run: (...args: any[]) =>
      new Promise<T>(async (resolve, reject) => {
        if (delay > 0) {
          await sleep(delay, abortController);
        }

        if (abortController.signal.aborted) {
          reject(abortController.signal.reason);
          return;
        }

        promiseFn(abortController.signal, ...args).then(resolve, reject);
      }),
    abort: (reason?: Error) => {
      abortController.abort(reason);
    }
  };
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
 * @param {Promise<Data> | ((signal: AbortSignal, ...args: Params) => Promise<Data>)} promiseFn The promise or function that returns a promise
 * @param {Data} initialData The initial data value
 * @param {UseAsyncStateOptions<Data>?} [options={ immediate: false, resetOnExecute: false, delay: 0 }] Optional options for the async state
 * @return {UseAsyncStateReturn<Data, Params>} An object containing the current state and functions to interact with the state
 *
 * @example
 * const { data, error, isLoading, execute } = useAsyncState(promiseFn, null, { immediate: false, delay: 1000 });
 */
export const useAsyncState = <Data, Params extends any[] = []>(
  promiseFn: (signal: AbortSignal, ...args: Params) => Promise<Data>,
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
  const abortFnRef = useRef<{ abort: (reason?: Error) => void } | null>(null);

  function cancel(reason?: Error) {
    if (abortFnRef.current) {
      abortFnRef.current.abort(reason);
      setIsLoading(false);
      if (reason) {
        setError(reason);
        onError(reason);
      }
    }
  }

  function execute(...args: any[]) {
    cancel(new Error('canceled due to new execution'));

    if (resetOnExecute) {
      setData(initialData);
    }

    setIsLoading(true);
    const { run, abort } = cancelablePromiseFn<Data>(promiseFn as any, delay);
    abortFnRef.current = { abort };

    const promise = run(...args)
      .then((res) => {
        setError(undefined);
        setData(res);
        onSuccess(res);
        return res;
      })
      .catch((err) => {
        setError(err);
        onError(err);
        return err;
      })
      .finally(() => {
        setIsLoading(false);
        abortFnRef.current = null;
      });

    return promise;
  }

  useEffect(() => {
    if (!isLoading && immediate) execute();
  }, [immediate]);

  return {
    data,
    error,
    isLoading,
    execute,
    cancel
  };
};
