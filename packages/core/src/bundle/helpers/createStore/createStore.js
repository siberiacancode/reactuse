import { useSyncExternalStore } from 'react';
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
export const createStore = (createState) => {
  let state;
  const listeners = new Set();
  const setState = (action) => {
    const nextState = typeof action === 'function' ? action(state) : action;
    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = nextState;
      listeners.forEach((listener) => listener(state, prevState));
    }
  };
  const getState = () => state;
  const getInitialState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  if (typeof createState === 'function') {
    state = createState(setState, getState);
  } else {
    state = createState;
  }
  const useStore = (selector) =>
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
};
