import { useState } from 'react';

/* The type of the options */
interface UseMutationOptions<Data> {
  /* The retry count of requests */
  retry?: ((failureCount: number, error: Error) => boolean) | boolean | number;
  /* The retry delay of requests */
  retryDelay?: ((retry: number, error: Error) => number) | number;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
}

/* The use mutation return type */
interface UseMutationReturn<Body, Data> {
  /* The data of the mutation */
  data: Data | null;
  /* The error of the mutation */
  error: Error | null;
  /* The error state of the mutation */
  isError: boolean;
  /* The loading state of the mutation */
  isLoading: boolean;
  /* The success state of the mutation */
  isSuccess: boolean;
  /* The mutate function */
  mutate: (body?: Body, options?: UseMutationOptions<Data>) => void;
  /* The mutate async function */
  mutateAsync: (body?: Body, options?: UseMutationOptions<Data>) => Promise<Data>;
}

export interface RequestOptions<Data> extends UseMutationOptions<Data> {
  /* The attempt count */
  attempt?: number;
}

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
export const useMutation = <Body, Data>(
  callback: (body: Body) => Promise<Data>,
  options?: UseMutationOptions<Data>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  const request = (
    body: Body,
    requestOptions?: RequestOptions<Data>
  ): Promise<Data | undefined> => {
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
      .catch((error: Error) => {
        const retry =
          typeof requestOptions?.retry === 'function'
            ? requestOptions?.retry(attempt, error)
            : requestOptions?.retry;

        const retryDelay =
          typeof requestOptions?.retryDelay === 'function'
            ? requestOptions?.retryDelay(attempt, error)
            : requestOptions?.retryDelay;

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
  const mutate = (body: Body, mutateOptions?: UseMutationOptions<Data>) => {
    const requestOptions = {
      retry: mutateOptions?.retry ?? options?.retry,
      retryDelay: mutateOptions?.retryDelay ?? options?.retryDelay,
      onSuccess: mutateOptions?.onSuccess ?? options?.onSuccess,
      onError: mutateOptions?.onError ?? options?.onError
    };

    request(body, requestOptions);
  };

  const mutateAsync = async (body: Body, mutateOptions?: UseMutationOptions<Data>) => {
    const requestOptions = {
      retry: mutateOptions?.retry ?? options?.retry,
      retryDelay: mutateOptions?.retryDelay ?? options?.retryDelay,
      onSuccess: mutateOptions?.onSuccess ?? options?.onSuccess,
      onError: mutateOptions?.onError ?? options?.onError
    };

    return request(body, requestOptions) as Promise<Data>;
  };

  return {
    data,
    error,
    mutate,
    mutateAsync,
    isLoading,
    isError,
    isSuccess
  } as UseMutationReturn<Body, Data>;
};
