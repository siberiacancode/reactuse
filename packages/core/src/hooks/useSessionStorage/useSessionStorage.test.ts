import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useSessionStorage } from './useSessionStorage';

it('Should use session storage', () => {
  const { result } = renderHook(() => useSessionStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('should use session storage on server side', () => {
  const { result } = renderHookServer(() => useSessionStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});
