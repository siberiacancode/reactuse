import { renderHook } from '@testing-library/react';

import { useLatest } from './useLatest';

it('Should use latest', () => {
  const { result } = renderHook(() => useLatest('value'));

  expect(result.current.value).toBe('value');
  expect(result.current.ref.current).toBe('value');
});

it('Should maintain reference stability', () => {
  const { result, rerender } = renderHook((value) => useLatest(value), {
    initialProps: 'value'
  });

  rerender('newValue');
  expect(result.current.value).toEqual('newValue');
  expect(result.current.ref.current).toEqual('newValue');
});
