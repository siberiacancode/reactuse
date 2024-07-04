import type { DependencyList } from 'react';
import { useEffect, useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

/* The use query return type */
export interface UseQueryOptions<QueryData, Data> {
  /* The depends for the hook */
  keys?: DependencyList;
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /* The select function to be invoked */
  select?: (data: QueryData) => Data;
  /* The initial data for the hook */
  initialData?: Data | (() => Data);
  /* The placeholder data for the hook */
  placeholderData?: Data | (() => Data);
  /* The retry count of requests */
  retry?: boolean | number;
  /* The refetch interval */
  refetchInterval?: number;
}

/* The use query return type */
export interface UseQueryReturn<Data> {
  /* The state of the query */
  data?: Data;
  /* The loading state of the query */
  isLoading: boolean;
  /* The error state of the query */
  isError: boolean;
  /* The success state of the query */
  isSuccess: boolean;
  /* The success state of the query */
  error?: Error;
  /* The refetch function */
  refetch: () => void;
  /* The refetch async function */
  isRefetching: boolean;
}

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
 * const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useQuery(() => fetch('https://example.com/data'));
 */
export const useQuery = <QueryData, Data = QueryData>(
  callback: () => Promise<QueryData>,
  options?: UseQueryOptions<QueryData, Data>
): UseQueryReturn<Data> => {
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(!!options?.initialData);

  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(options?.initialData);

  const request = (action: 'init' | 'refetch') => {
    setIsLoading(true);
    if (action === 'refetch') setIsRefetching(true);

    callback()
      .then((response) => {
        const data = options?.select ? options?.select(response) : response;
        options?.onSuccess?.(data as Data);
        setData(data as Data);
        setIsSuccess(true);
        setIsLoading(false);
        setError(undefined);
        setIsError(false);
        if (action === 'refetch') setIsRefetching(false);
      })
      .catch((error: Error) => {
        if (retryCountRef.current > 0) {
          retryCountRef.current -= 1;
          return request(action);
        }
        options?.onError?.(error);
        setData(undefined);
        setIsSuccess(false);
        setIsLoading(false);
        setError(error);
        setIsError(true);
        if (action === 'refetch') setIsRefetching(false);
        retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
      })
      .finally(() => {
        if (options?.refetchInterval) {
          const interval = setInterval(() => {
            request('refetch');
            clearInterval(interval);
          }, options?.refetchInterval);
        }
      });
  };

  useEffect(() => {
    if (options?.initialData) return;
    request('init');
  }, options?.keys ?? []);

  const refetch = () => request('refetch');

  const placeholderData =
    options?.placeholderData instanceof Function
      ? options?.placeholderData()
      : options?.placeholderData;

  return {
    data: data ?? placeholderData,
    error,
    refetch,
    isLoading,
    isError,
    isSuccess,
    isRefetching
  };
};
