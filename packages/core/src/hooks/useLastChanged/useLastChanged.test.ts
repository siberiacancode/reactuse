import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useLastChanged } from './useLastChanged';

it('Should use last changed', () => {
  const { result } = renderHook(() => useLastChanged('value'));

  expect(result.current).toBeNull();
});

it('Should use last changed on server side', () => {
  const { result } = renderHookServer(() => useLastChanged('value'));

  expect(result.current).toBeNull();
});

it('Should return timestamp when value changes', () => {
  const { result, rerender } = renderHook((text = 'init text') => useLastChanged(text));

  rerender('changed text');

  expect(result.current).toBeCloseTo(Date.now(), -1);
});

it('Should return initial value', () => {
  const initialValue = Date.now();

  const { result } = renderHook(() => useLastChanged(null, { initialValue }));

  expect(result.current).toBe(initialValue);
});
