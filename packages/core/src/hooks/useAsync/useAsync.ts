import type { DependencyList } from 'react';

import { useEffect, useState } from 'react';

/* The use query return type */
export interface UseAsyncReturn<Data> {
  /* The state of the query */
  data?: Data;
  /* The error of the query */
  error?: Error;
  /* The error state of the query  */
  isError: boolean;
  /* The loading state of the query */
  isLoading: boolean;
}

/**
 * @name useAsync
 * @description - Hook that provides the state of an async callback
 * @category Async
 * @usage medium
 *
 * @param {() => Promise<Data>} callback The async callback
 * @param {DependencyList} [deps=[]] The dependencies of the callback
 * @returns {UseAsyncReturn<Data>} The state of the async callback
 *
 * @example
 * const { data, isLoading, isError, error } = useAsync(() => fetch('url'), [deps]);
 */
export const useAsync = <Data>(
  callback: () => Promise<Data>,
  deps: DependencyList = []
): UseAsyncReturn<Data> => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    callback()
      .then((response) => {
        setData(response);
        setError(undefined);
        setIsError(false);
      })
      .catch((error: Error) => {
        setError(error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, deps);

  return {
    data,
    isLoading,
    isError,
    error
  };
};
