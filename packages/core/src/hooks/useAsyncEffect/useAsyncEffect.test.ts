import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useAsyncEffect } from './useAsyncEffect';

it('Should use async event', () => {
  const callback = vi.fn(() => Promise.resolve('data'));

  renderHook(() => useAsyncEffect(callback));

  expect(callback).toHaveBeenCalledOnce();
});

it('Should use async event on server side', () => {
  const callback = vi.fn(() => Promise.resolve('data'));

  renderHookServer(() => useAsyncEffect(callback));

  expect(callback).not.toHaveBeenCalled();
});
