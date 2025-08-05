import { useState } from 'react';
/**
 * @name useObject
 * @description - Hook that provides state and helper methods to manage an object
 * @category State
 *
 * @template T The type of the object
 * @param {T} initialValue The initial object value
 * @returns {UseObjectReturn<T>} An object containing the current state and functions to interact with the object
 *
 * @example
 * const { state, set, get, reset, update, merge, remove } = useObject({ a: 1, b: 2 });
 */
export function useObject(initialValue) {
  const [state, setState] = useState(initialValue);
  const set = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const get = (key) => {
    return state[key];
  };
  const reset = () => {
    setState(initialValue);
  };
  const update = (updater) => {
    setState((prev) => updater(prev));
  };
  const merge = (newState) => {
    setState((prev) => ({
      ...prev,
      ...newState
    }));
  };
  const remove = (key) => {
    setState((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };
  return {
    state,
    set,
    get,
    reset,
    update,
    merge,
    remove
  };
}
