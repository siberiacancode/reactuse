import { renderHook } from '@testing-library/react';

import { useLastChanged } from './useLastChanged';

it('Should use last changed', () => {
  const { result } = renderHook(useLastChanged);

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
