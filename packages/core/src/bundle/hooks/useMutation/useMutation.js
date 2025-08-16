import { useState } from 'react';
/**
 * @name useMutation
 * @description - Hook that defines the logic when mutate data
 * @category Async
 * @usage high
 *
 * @template Body The type of the body
 * @template Data The type of the data
 * @param {(body: Body) => Promise<Data>} callback The callback function to be invoked
 * @param {boolean | number} [options.retry] The retry count of requests
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @returns {UseMutationReturn<Data>} An object with the state of the mutation
 *
 * @example
 * const { mutate, mutateAsync, isLoading, isError, isSuccess, error, data } = useMutation((name) => Promise.resolve(name));
 */
export const useMutation = (callback, options) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const request = (body, requestOptions) => {
    setIsLoading(true);
    const attempt = requestOptions?.attempt ?? 0;
    return callback(body)
      .then((response) => {
        requestOptions?.onSuccess?.(response);
        setData(response);
        setIsSuccess(true);
        setIsLoading(false);
        setError(null);
        setIsError(false);
        return response;
      })
      .catch((error) => {
        const retry =
          typeof requestOptions?.retry === 'function'
            ? requestOptions?.retry(attempt, error)
            : requestOptions?.retry;
        const retryDelay =
          typeof requestOptions?.retryDelay === 'function'
            ? requestOptions?.retryDelay(attempt, error)
            : requestOptions?.retryDelay;
        console.log('retryDelay', retryDelay);
        if (typeof retry === 'boolean' && retry) {
          if (retryDelay) {
            setTimeout(
              () => request(body, { ...requestOptions, attempt: attempt + 1 }),
              retryDelay
            );
            return;
          }
          return request(body, { ...requestOptions, attempt: attempt + 1 });
        }
        if (retry && retry > attempt) {
          if (retryDelay) {
            setTimeout(
              () => request(body, { ...requestOptions, attempt: attempt + 1 }),
              retryDelay
            );
            return;
          }
          return request(body, { ...requestOptions, attempt: attempt + 1 });
        }
        requestOptions?.onError?.(error);
        setData(null);
        setIsSuccess(false);
        setIsLoading(false);
        setError(error);
        setIsError(true);
      });
  };
  const mutate = (body, mutateOptions) => {
    const requestOptions = {
      retry: mutateOptions?.retry ?? options?.retry,
      retryDelay: mutateOptions?.retryDelay ?? options?.retryDelay,
      onSuccess: mutateOptions?.onSuccess ?? options?.onSuccess,
      onError: mutateOptions?.onError ?? options?.onError
    };
    request(body, requestOptions);
  };
  const mutateAsync = async (body, mutateOptions) => {
    const requestOptions = {
      retry: mutateOptions?.retry ?? options?.retry,
      retryDelay: mutateOptions?.retryDelay ?? options?.retryDelay,
      onSuccess: mutateOptions?.onSuccess ?? options?.onSuccess,
      onError: mutateOptions?.onError ?? options?.onError
    };
    return request(body, requestOptions);
  };
  return {
    data,
    error,
    mutate,
    mutateAsync,
    isLoading,
    isError,
    isSuccess
  };
};
