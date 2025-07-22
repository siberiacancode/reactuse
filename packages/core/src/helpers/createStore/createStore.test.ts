import { act, renderHook } from '@testing-library/react';

import { createStore } from './createStore';

let store: ReturnType<typeof createStore<number>>;

beforeEach(() => {
  store = createStore(0);
  store = createStore(() => 0);
});

it('Should create store', () => {
  expect(store.set).toBeTypeOf('function');
  expect(store.get).toBeTypeOf('function');
  expect(store.subscribe).toBeTypeOf('function');
  expect(store.use).toBeTypeOf('function');
});

it('Should return initial state', () => {
  expect(store.get()).toEqual(0);
});

it('Should update state with set', () => {
  store.set(5);

  expect(store.get()).toEqual(5);
});

it('Should update state with set with updater function', () => {
  store.set((state) => state + 2);

  expect(store.get()).toEqual(2);
});

it('Should notify subscribers on state change', () => {
  const listener = vi.fn();

  store.subscribe(listener);
  store.set(1);

  expect(listener).toHaveBeenCalledWith(1, 0);
});

it('Should not notify subscribers if state is not changed', () => {
  const listener = vi.fn();

  store.subscribe(listener);
  store.set(0);

  expect(listener).not.toHaveBeenCalled();
});

it('Should allow unsubscribing', () => {
  const listener = vi.fn();
  const unsubscribe = store.subscribe(listener);

  unsubscribe();
  store.set(1);

  expect(listener).not.toHaveBeenCalled();
});

it('Should work with selector in use', () => {
  const { result } = renderHook(() => store.use((state) => state));
  expect(result.current).toBe(0);

  act(() => store.set(5));

  expect(result.current).toBe(5);
});

it('Should not rerender if selector result is the same', () => {
  let renderCount = 0;
  const { result } = renderHook(() => {
    renderCount++;
    return store.use((state) => state);
  });

  expect(result.current).toBe(0);

  act(() => store.set(0));

  expect(renderCount).toBe(1);

  act(() => store.set(1));

  expect(renderCount).toBe(2);
});
