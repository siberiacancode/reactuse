import { act, renderHook } from '@testing-library/react';

import { usePageLeave } from './usePageLeave';

it('Should use page leave', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => usePageLeave(callback));
  expect(typeof result.current).toBe('boolean');
});

it('Should call the callback on page leave', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => usePageLeave(callback));
  expect(result.current).toBe(false);

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toBeCalledTimes(1);
  expect(result.current).toBe(true);

  act(() => document.dispatchEvent(new Event('mouseenter')));
  expect(result.current).toBe(false);

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toBeCalledTimes(2);
  expect(result.current).toBe(true);
});
