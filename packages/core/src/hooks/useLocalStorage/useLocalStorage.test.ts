import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useLocalStorage } from './useLocalStorage';

it('Should use session storage', () => {
  const { result } = renderHook(() => useLocalStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('should use session storage on server side', () => {
  const { result } = renderHookServer(() => useLocalStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('undefined');
  expect(result.current.remove).toBeTypeOf('undefined');
});
