import { useEffect, useRef, useState } from 'react';
import { getRetry } from '@/utils/helpers';
import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useMount } from '../useMount/useMount';
/**
 * @name useQuery
 * @description - Hook that defines the logic when query data
 * @category Utilities
 *
 * @template Data The type of the data
 * @param {() => Promise<Data>} callback The callback function to be invoked
 * @param {DependencyList} [options.keys] The dependencies for the hook
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @param {UseQueryOptionsSelect<Data>} [options.select] The select function to be invoked
 * @param {Data | (() => Data)} [options.initialData] The initial data for the hook
 * @param {Data | (() => Data)} [options.placeholderData] The placeholder data for the hook
 * @param {number} [options.refetchInterval] The refetch interval
 * @param {boolean | number} [options.retry] The retry count of requests
 * @returns {UseQueryReturn<Data>} An object with the state of the query
 *
 * @example
 * const { data, isFetching, isLoading, isError, isSuccess, error, refetch, isRefetching, abort, aborted } = useQuery(() => fetch('url'));
 */
export const useQuery = (callback, options) => {
  const enabled = options?.enabled ?? true;
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);
  const alreadyRequested = useRef(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(!!options?.initialData);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(options?.initialData);
  const abortControllerRef = useRef(new AbortController());
  const intervalIdRef = useRef();
  const keys = options?.keys ?? [];
  const abort = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };
  const request = (action) => {
    abort();
    setIsFetching(true);
    if (action === 'init') {
      alreadyRequested.current = true;
      setIsLoading(true);
    }
    if (action === 'refetch') setIsRefetching(true);
    callback({ signal: abortControllerRef.current.signal, keys })
      .then((response) => {
        const data = options?.select ? options?.select(response) : response;
        options?.onSuccess?.(data);
        setData(data);
        setIsSuccess(true);
        setError(undefined);
        setIsError(false);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .catch((error) => {
        if (retryCountRef.current > 0) {
          retryCountRef.current -= 1;
          const retryDelay =
            typeof options?.retryDelay === 'function'
              ? options?.retryDelay(retryCountRef.current, error)
              : options?.retryDelay;
          if (retryDelay) {
            setTimeout(() => request(action), retryDelay);
            return;
          }
          return request(action);
        }
        options?.onError?.(error);
        setData(undefined);
        setIsSuccess(false);
        setError(error);
        setIsError(true);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
        retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
      })
      .finally(() => {
        if (options?.refetchInterval) {
          const interval = setInterval(() => {
            clearInterval(interval);
            request('refetch');
          }, options?.refetchInterval);
          intervalIdRef.current = interval;
        }
      });
  };
  useMount(() => {
    if (!enabled) return;
    request('init');
  });
  useDidUpdate(() => {
    if (!enabled) return;
    request(alreadyRequested.current ? 'refetch' : 'init');
  }, [enabled, ...keys]);
  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [enabled, options?.refetchInterval, options?.retry, ...keys]);
  const refetch = () => request('refetch');
  const placeholderData =
    typeof options?.placeholderData === 'function'
      ? (options?.placeholderData)()
      : options?.placeholderData;
  return {
    abort,
    data: data ?? placeholderData,
    error,
    refetch,
    isFetching,
    isLoading,
    isError,
    isSuccess,
    isRefetching
  };
};
