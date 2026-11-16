---
title: useMutation
description: Hook that defines the logic when mutate data
category: async
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779190580000
---

# useMutation

Hook that defines the logic when mutate data

## Demo

```tsx
import { useMutation, useQuery } from '@siberiacancode/reactuse';
import { BadgeCheckIcon, CalendarIcon, Loader2Icon } from 'lucide-react';

interface Profile {
  description: string;
  followers: number;
  following: boolean;
  followingCount: number;
  handle: string;
  joined: string;
  name: string;
}

const profile: Profile = {
  name: 'siberiacancode',
  handle: '@siberiacancode',
  description:
    'We are a group of developers with years of experience. We specialize in development of web applications, servers and browser extensions.',
  joined: 'Joined June 2024',
  following: false,
  followingCount: 892,
  followers: 124000
};

const fetchProfile = () =>
  new Promise<Profile>((resolve) => setTimeout(resolve, 1000, { ...profile }));

const toggleFollow = (next: boolean) =>
  new Promise<Profile>((resolve) =>
    setTimeout(() => {
      profile.following = next;
      profile.followers += next ? 1 : -1;
      resolve({ ...profile });
    }, 1200)
  );

const formatCount = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return `${count}`;
};

const Demo = () => {
  const profileQuery = useQuery(fetchProfile, {
    enabled: false,
    placeholderData: profile
  });
  const followMutation = useMutation(toggleFollow);

  const data = profileQuery.data!;

  const onToggleFollow = async () => {
    await followMutation.mutateAsync(!data.following);
    profileQuery.refetch();
  };

  const loading = followMutation.isLoading || profileQuery.isRefetching;

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='h-32 w-full rounded-2xl bg-gradient-to-br from-zinc-100 via-stone-200 to-neutral-300' />

      <div className='flex items-end justify-between'>
        <div className='ring-background -mt-12 ml-1 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-2xl font-bold text-white ring-4'>
          SC
        </div>

        <button
          className='group min-w-[112px] rounded-full!'
          data-variant={data.following ? 'outline' : 'default'}
          disabled={loading}
          type='button'
          onClick={onToggleFollow}
        >
          {loading ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : data.following ? (
            <>
              <span className='group-hover:hidden'>Following</span>
              <span className='hidden group-hover:inline'>Unfollow</span>
            </>
          ) : (
            'Follow'
          )}
        </button>
      </div>

      <div className='mt-3 flex flex-col gap-0.5'>
        <div className='flex items-center gap-1'>
          <span className='text-foreground text-xl font-bold'>{data.name}</span>
          <BadgeCheckIcon className='text-foreground size-5' />
        </div>
        <span className='text-muted-foreground text-sm'>{data.handle}</span>
      </div>

      <p className='text-foreground mt-3 text-sm leading-relaxed'>{data.description}</p>

      <div className='text-muted-foreground mt-3 flex items-center gap-1.5 text-sm'>
        <CalendarIcon className='size-4' />
        <span>{data.joined}</span>
      </div>

      <div className='mt-3 flex gap-5 text-sm'>
        <span className='text-foreground font-bold'>
          {data.followingCount} <span className='text-muted-foreground font-normal'>Following</span>
        </span>
        <span className='text-foreground font-bold'>
          {formatCount(data.followers)}{' '}
          <span className='text-muted-foreground font-normal'>Followers</span>
        </span>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useMutation
```

### Manual

Copy and paste the following code into your project.

```tsx
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
            setTimeout(request, retryDelay, body, { ...requestOptions, attempt: attempt + 1 });
            return;
          }
          return request(body, { ...requestOptions, attempt: attempt + 1 });
        }

        if (retry && retry > attempt) {
          if (retryDelay) {
            setTimeout(request, retryDelay, body, { ...requestOptions, attempt: attempt + 1 });
            return;
          }
          return request(body, { ...requestOptions, attempt: attempt + 1 });
        }

        setData(null);
        setIsSuccess(false);
        setIsLoading(false);
        setError(error);
        setIsError(true);
        if (!requestOptions?.onError) throw error;
        requestOptions?.onError?.(error);
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
```

Update the import paths to match your project setup.

## Usage

```tsx
const { mutate, mutateAsync, isLoading, isError, isSuccess, error, data } = useMutation((name) => Promise.resolve(name));
```

## Type Declarations

```tsx
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
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(body: Body) => Promise<Data>` | - | The callback function to be invoked |
| options.retry | `boolean \| number` | - | The retry count of requests |
| options.onSuccess | `(data: Data) => void` | - | The callback function to be invoked on success |
| options.onError | `(error: Error) => void` | - | The callback function to be invoked on error |

### Returns

`UseMutationReturn<Data>` - An object with the state of the mutation