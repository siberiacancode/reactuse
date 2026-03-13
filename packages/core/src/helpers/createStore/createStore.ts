import { useSyncExternalStore } from 'react';

type StoreSetAction<Value> = ((prev: Value) => Partial<Value>) | Partial<Value>;

type StoreListener<Value> = (state: Value, prevState: Value) => void;

type StoreCreator<Value> = (
  set: (action: StoreSetAction<Value>) => void,
  get: () => Value
) => Value;

export interface StoreApi<Value> {
  get: () => Value;
  getInitial: () => Value;
  set: (action: StoreSetAction<Value>) => void;
  subscribe: (listener: StoreListener<Value>) => () => void;

  use: (() => Value) &
    (<Selected>(selector: (state: Value) => Selected) => Selected) &
    (<Selected>(selector?: (state: Value) => Selected) => Selected | Value);
}

/**
 * @name createStore
 * @description - Creates a store with state management capabilities
 * @category Helpers
 * @usage medium
 *
 * @template Value - The type of the store state
 * @param {StateCreator<Value>} createState - Function that initializes the store state
 * @returns {StoreApi<Value>} - Object containing store methods and hook for accessing state
 *
 * @example
 * const { set, get, use, subscribe } = createStore((set) => ({
 *   count: 0,
 *   increment: () => set(state => ({ count: state.count + 1 }))
 * }));
 */
export const createStore = <Value>(createState: StoreCreator<Value> | Value): StoreApi<Value> => {
  let state: Value;
  let initialState: Value;
  const listeners: Set<StoreListener<Value>> = new Set();

  const setState: StoreApi<Value>['set'] = (action: StoreSetAction<Value>) => {
    const nextState = typeof action === 'function' ? action(state) : action;

    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = (
        typeof nextState !== 'object' || nextState === null || Array.isArray(nextState)
          ? nextState
          : Object.assign({}, state, nextState)
      ) as Value;

      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const subscribe = (listener: StoreListener<Value>) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const getState = () => state;
  const getInitialState = () => initialState;

  if (typeof createState === 'function') {
    initialState = state = (createState as StoreCreator<Value>)(setState, getState);
  } else {
    initialState = state = createState;
  }

  function useStore(): Value;
  function useStore<Selected>(selector: (state: Value) => Selected): Selected;
  function useStore<Selected>(selector?: (state: Value) => Selected): Selected | Value {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(getState()) : getState()),
      () => (selector ? selector(getInitialState()) : getInitialState())
    );
  }

  return {
    set: setState,
    get: getState,
    getInitial: getInitialState,
    use: useStore,
    subscribe
  };
};
