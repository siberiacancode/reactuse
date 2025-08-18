import { renderHook, waitFor } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useImage } from './useImage';

it('Should use image', () => {
  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  expect(result.current.isLoading).toBeTruthy();
  expect(result.current.isFetching).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.refetch).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should use image on server side', () => {
  const { result } = renderHookServer(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg')
  );

  expect(result.current.isLoading).toBeFalsy();
  expect(result.current.isFetching).toBeFalsy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.isSuccess).toBeFalsy();
  expect(result.current.refetch).toBeTypeOf('function');
  expect(result.current.abort).toBeTypeOf('function');
  expect(result.current.error).toBeUndefined();
  expect(result.current.data).toBeUndefined();
});

it('Should apply all image options correctly', async () => {
  const options = {
    alt: 'test alt',
    class: 'test-image-class',
    crossorigin: 'anonymous',
    loading: 'lazy',
    referrerPolicy: 'no-referrer',
    sizes: '(max-width: 600px) 480px, 800px',
    srcset: 'image-320w.jpg 320w, image-480w.jpg 480w, image-800w.jpg 800w'
  } as const;

  const { result } = renderHook(() =>
    useImage('https://siberiacancode.github.io/reactuse/logo.svg', options)
  );

  await waitFor(() => {
    if (!result.current.data) return;

    expect(result.current.data.src).toBe('https://siberiacancode.github.io/reactuse/logo.svg');
    expect(result.current.data.srcset).toBe(options.srcset);
    expect(result.current.data.sizes).toBe(options.sizes);
    expect(result.current.data.className).toBe(options.class);
    expect(result.current.data.loading).toBe(options.loading);
    expect(result.current.data.crossOrigin).toBe(options.crossorigin);
    expect(result.current.data.referrerPolicy).toBe(options.referrerPolicy);
  });
});
