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
  const { result } = renderHook(() => store.use());
  expect(result.current).toBe(0);

  act(() => store.set(5));

  expect(result.current).toBe(5);
});

it('Should not rerender if selector result is the same', () => {
  let renderCount = 0;
  const { result } = renderHook(() => {
    renderCount++;
    return store.use();
  });

  expect(result.current).toBe(0);

  act(() => store.set(0));

  expect(renderCount).toBe(1);

  act(() => store.set(1));

  expect(renderCount).toBe(2);
});

it('Should work with specific selector', () => {
  const { result } = renderHook(() => store.use((state) => state * 2));
  expect(result.current).toBe(0);

  act(() => store.set(5));

  expect(result.current).toBe(10);
});

it('Should work with partial state change', () => {
  const store = createStore({ count: 0, value: 'value' });
  const listener = vi.fn();
  store.subscribe(listener);

  store.set({ count: 1 });

  expect(store.get()).toEqual({ count: 1, value: 'value' });
  expect(listener).toHaveBeenCalledWith({ count: 1, value: 'value' }, { count: 0, value: 'value' });
});

it('Should work with create state function', () => {
  interface State {
    count: number;
    increment: () => void;
  }

  const store = createStore<State>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }));

  expect(store.get().count).toBe(0);
  store.set((state) => ({ count: state.count + 1 }));
  expect(store.get().count).toBe(1);
  store.set((state) => ({ count: state.count + 1 }));
  expect(store.get().count).toBe(2);
});

it('Should work correct with array state', () => {
  const store = createStore<number[]>([]);

  expect(store.get()).toEqual([]);
  store.set([1, 2, 3]);
  expect(store.get()).toEqual([1, 2, 3]);
});

it('Should return initial state after state changes', () => {
  const counterStore = createStore<number>(0)

  counterStore.set(1)

  expect(store.getInitialState()).toEqual(0)
})
