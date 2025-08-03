import { useSyncExternalStore } from 'react';

type SetStateAction<Value> = ((prev: Value) => Partial<Value>) | Partial<Value>;

type Listener<Value> = (state: Value, prevState: Value) => void;

type StateCreator<Value> = (
  set: (action: SetStateAction<Value>) => void,
  get: () => Value
) => Value;

function isStateCreator<Value>(fn: unknown): fn is StateCreator<Value> {
  return typeof fn === 'function';
}

function isActionFunction<Value>(fn: unknown): fn is (prev: Value) => Partial<Value> {
  return typeof fn === 'function';
}

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
 * @param {StateCreator<Value>} createState - Function that initializes the store state
 * @returns {StoreApi<Value>} - Object containing store methods and hook for accessing state
 *
 * @example
 * const { set, get, use, subscribe } = createStore((set) => ({
 *   count: 0,
 *   increment: () => set(state => ({ count: state.count + 1 }))
 * }));
 */
export const createStore = <Value>(createState: StateCreator<Value> | Value) => {
  let state: Value;
  const listeners: Set<Listener<Value>> = new Set();

  const setState: StoreApi<Value>['setState'] = (action: SetStateAction<Value>) => {
    const nextState = isActionFunction<Value>(action) ? action(state) : action;

    if (!Object.is(nextState, state)) {
      const prevState = state;
      state =
        typeof nextState !== 'object' || nextState === null
          ? nextState
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, prevState));
    }
  };

  const subscribe = (listener: Listener<Value>) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const getState = () => state;
  const getInitialState = () => state;

  if (isStateCreator<Value>(createState)) {
    state = createState(setState, getState);
  } else {
    state = createState;
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
    use: useStore,
    subscribe
  };
};
