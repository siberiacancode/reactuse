import { useEffect, useRef, useState } from 'react';
import { getRetry } from '@/utils/helpers';
import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
import { useMount } from '../useMount/useMount';
/**
 * @name useQuery
 * @description - Hook that defines the logic when query data
 * @category Async
 * @usage high
 *
 * @template Data The type of the data
 * @param {() => Promise<Data>} callback The callback function to be invoked
 * @param {DependencyList} [options.keys] The dependencies for the hook
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @param {UseQueryOptionsSelect<Data>} [options.select] The select function to be invoked
 * @param {Data | (() => Data)} [options.placeholderData] The placeholder data for the hook
 * @param {number} [options.refetchInterval] The refetch interval
 * @param {boolean | number | ((failureCount: number, error: Error) => boolean)} [options.retry] The retry count of requests, or a function to decide whether to retry
 * @returns {UseQueryReturn<Data>} An object with the state of the query
 *
 * @example
 * const { data, isFetching, isLoading, isError, isSuccess, error, refetch, isRefetching, abort } = useQuery(() => fetch('url'));
 */
export const useQuery = (callback, options) => {
  const enabled = options?.enabled ?? true;
  const canRequestOnMount = enabled && typeof window !== 'undefined';
  const failureCountRef = useRef(0);
  const alreadyRequestedRef = useRef(false);
  const [isFetching, setIsFetching] = useState(canRequestOnMount);
  const [isLoading, setIsLoading] = useState(canRequestOnMount);
  const [isError, setIsError] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(!!options?.placeholderData);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(options?.placeholderData);
  const abortControllerRef = useRef(new AbortController());
  const intervalIdRef = useRef(undefined);
  const keys = options?.keys ?? [];
  const abort = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };
  const request = (action) => {
    abort();
    setIsFetching(true);
    if (action === 'init') {
      alreadyRequestedRef.current = true;
      setIsLoading(true);
    }
    if (action === 'refetch') setIsRefetching(true);
    return callback({ signal: abortControllerRef.current.signal, keys })
      .then((response) => {
        const data = options?.select ? options?.select(response) : response;
        options?.onSuccess?.(data);
        failureCountRef.current = 0;
        setData(data);
        setIsSuccess(true);
        setError(undefined);
        setIsError(false);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .catch((error) => {
        if (
          typeof options?.retry === 'function'
            ? options.retry(failureCountRef.current, error)
            : failureCountRef.current < getRetry(options?.retry ?? 0)
        ) {
          failureCountRef.current += 1;
          request(action);
          return;
        }
        options?.onError?.(error);
        failureCountRef.current = 0;
        setData(undefined);
        setIsSuccess(false);
        setError(error);
        setIsError(true);
        setIsFetching(false);
        if (action === 'init') setIsLoading(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .finally(() => {
        const refetchInterval =
          typeof options?.refetchInterval === 'function'
            ? options.refetchInterval()
            : options?.refetchInterval;
        if (refetchInterval) {
          const interval = setInterval(() => {
            clearInterval(interval);
            request('refetch');
          }, refetchInterval);
          intervalIdRef.current = interval;
        }
      });
  };
  useMount(() => {
    if (!enabled) return;
    void request('init');
  });
  useDidUpdate(() => {
    if (!enabled) return;
    void request(alreadyRequestedRef.current ? 'refetch' : 'init');
  }, [enabled, ...keys]);
  useEffect(
    () => () => {
      clearInterval(intervalIdRef.current);
    },
    [enabled, options?.retry, ...keys]
  );
  const refetch = () => {
    request('refetch');
  };
  const fetch = () => request('refetch');
  return {
    abort,
    data,
    error,
    refetch,
    isFetching,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
    fetch
  };
};
