import { useEffect, useState } from 'react';
/**
 * @name useAsync
 * @description - Hook that provides the state of an async callback
 * @category Utilities
 *
 * @param {() => Promise<Data>} callback - The async callback
 * @param {DependencyList} deps - The dependencies of the callback
 * @returns {UseAsyncReturn<Data>} - The state of the async callback
 *
 * @example
 * const { data, isLoading, isError, error } = useAsync(() => fetch('url'), [deps]);
 */
export const useAsync = (callback, deps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(undefined);
  const [data, setData] = useState(undefined);
  useEffect(() => {
    setIsLoading(true);
    callback()
      .then((response) => {
        setData(response);
        setError(undefined);
        setIsError(false);
      })
      .catch((error) => {
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
