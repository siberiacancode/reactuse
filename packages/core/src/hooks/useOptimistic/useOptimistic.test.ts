import { act, renderHook } from '@testing-library/react';

import { useOptimistic } from './useOptimistic';

beforeEach(vi.useFakeTimers);
afterEach(vi.useRealTimers);

it('Should use optimistic', () => {
  const { result } = renderHook(() =>
    useOptimistic(0, (current, optimistic: number) => current + optimistic)
  );

  const [, update] = result.current;

  expect(result.current[0]).toBe(0);
  expect(update).toBeTypeOf('function');
});

it('Should update optimistic value', async () => {
  const { result } = renderHook(() =>
    useOptimistic(0, (current, optimistic: number) => current + optimistic)
  );

  const [, update] = result.current;

  const promise = new Promise((resolve) => setTimeout(resolve, 100));

  await act(async () => {
    update(1, promise);
  });

  expect(result.current[0]).toBe(1);

  await act(async () => {
    vi.advanceTimersByTime(100);
    await promise;
  });

  expect(result.current[0]).toBe(0);
});

it('Should handle rejected promise', async () => {
  const { result } = renderHook(() =>
    useOptimistic(0, (current, optimistic: number) => current + optimistic)
  );

  const [, update] = result.current;
  const promise = new Promise((_resolve, reject) => setTimeout(reject, 100)).catch(() => {});

  await act(async () => {
    update(1, promise);
  });

  expect(result.current[0]).toBe(1);

  await act(async () => {
    vi.advanceTimersByTime(100);
    await promise;
  });

  expect(result.current[0]).toBe(0);
});

it('Should not update external state', async () => {
  const { result, rerender } = renderHook(
    (value) => useOptimistic(value, (current, optimistic: number) => current + optimistic),
    { initialProps: 0 }
  );

  const [, update] = result.current;

  expect(result.current[0]).toBe(0);

  act(() => rerender(1));

  expect(result.current[0]).toBe(0);

  const promise = new Promise((resolve) => setTimeout(resolve, 100));

  await act(async () => {
    update(1, promise);
  });

  await act(async () => {
    vi.advanceTimersByTime(100);
    await promise;
  });

  expect(result.current[0]).toBe(1);
});
