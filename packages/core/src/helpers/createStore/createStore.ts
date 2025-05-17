import { useSyncExternalStore } from 'react';

type SetStateAction<Value> = ((prev: Value) => Value) | Value;
type StateCreator<Value> = (
  set: (action: SetStateAction<Value>) => void,
  get: () => Value
) => Value;

export interface StoreApi<Value> {
  getInitialState: () => Value;
  getState: () => Value;
  setState: (action: SetStateAction<Value>) => void;
  subscribe: (listener: (state: Value, prevState: Value) => void) => () => void;
}

/**
 * @name createStore
 * @description - Creates a store with state management capabilities
 * @category Helpers
 *
 * @template Value - The type of the store state
 *
 * @param {StateCreator<Value>} createState - Function that initializes the store state
 * @returns {StoreApi<Value>} - Object containing store methods and hook for accessing state
 *
 * @example
 * const { set, get, use, subscribe } = createStore((set) => ({
 *   count: 0,
 *   increment: () => set(state => ({ count: state.count + 1 }))
 * }));
 */
export function createStore<Value>(createState: StateCreator<Value> | Value) {
  type Listener = (state: Value, prevState: Value) => void;
  let state: Value;
  const listeners: Set<Listener> = new Set();

  const setState = (action: SetStateAction<Value>) => {
    const nextState =
      typeof action === 'function' ? (action as (state: Value) => Value)(state) : action;

    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = nextState;
      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const getState = () => state;
  const getInitialState = () => state;

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  if (typeof createState === 'function') {
    state = (createState as StateCreator<Value>)(setState, getState);
  } else {
    state = createState;
  }

  const useStore = <Selected>(selector: (state: Value) => Selected) =>
    useSyncExternalStore(
      subscribe,
      () => selector(getState()),
      () => selector(getInitialState())
    );

  return {
    set: setState,
    get: getState,
    use: useStore,
    subscribe
  };
}

const counterStore = createStore<{ count: number }>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

console.log(counterStore.get());
counterStore.set((state) => ({ count: state.count + 1 }));
console.log(counterStore.get());
