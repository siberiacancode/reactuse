import { useRef, useState } from 'react';

import { getRetry } from '@/utils/helpers';

/* The type of the options */
interface UseMutationOptions<Data> {
  /* The retry count of requests */
  retry?: boolean | number;
  /* The callback function to be invoked on success */
  onSuccess?: (data: Data) => void;
  /* The callback function to be invoked on error */
  onError?: (error: Error) => void;
}

/* The use mutation return type */
interface UseMutationReturn<Body, Data> {
  /* The data of the mutation */
  data: Data | null;
  /* The error of the mutation */
  error: Error | null;
  /* The mutate function */
  mutate: (body: Body) => void;
  /* The mutate async function */
  mutateAsync: (body: Body) => Promise<Data>;
  /* The loading state of the mutation */
  isLoading: boolean;
  /* The error state of the mutation */
  isError: boolean;
  /* The success state of the mutation */
  isSuccess: boolean;
}

/**
 * @name useMutation
 * @description - Hook that defines the logic when mutate data
 * @category Utilities
 *
 * @template Body - The type of the body
 * @template Data - The type of the data
 * @param {(body: Body) => Promise<Data>} callback - The callback function to be invoked
 * @param {boolean | number} [options.retry] - The retry count of requests
 * @param {(data: Data) => void} [options.onSuccess] - The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] - The callback function to be invoked on error
 * @returns {UseMutationReturn<Data>} An object with the state of the mutation
 *
 * @example
 * const { mutate, mutateAsync, isLoading, isError, isSuccess, error, data } = useMutation((name) => Promise.resolve(name));
 */
export const useMutation = <Body, Data>(
  callback: (body: Body) => Promise<Data>,
  options?: UseMutationOptions<Data>
) => {
  const retryCountRef = useRef(options?.retry ? getRetry(options.retry) : 0);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  const request = (body: Body): Promise<Data | undefined> => {
    setIsLoading(true);

    return callback(body)
      .then((response) => {
        options?.onSuccess?.(response);
        setData(response);
        setIsSuccess(true);
        setIsLoading(false);
        setError(null);
        setIsError(false);
        return response;
      })
      .catch((error: Error) => {
        if (retryCountRef.current > 0) {
          retryCountRef.current -= 1;
          return request(body);
        }

        options?.onError?.(error);
        setData(null);
        setIsSuccess(false);
        setIsLoading(false);
        setError(error);
        setIsError(true);
        retryCountRef.current = options?.retry ? getRetry(options.retry) : 0;
      });
  };
  const mutate = (body: Body): void => {
    request(body);
  };

  const mutateAsync = async (body: Body) => request(body) as Promise<Data>;

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
