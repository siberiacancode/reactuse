import { useState } from 'react';

/** The useObject return type */
export interface UseObjectReturn<T extends object> {
  /** The current object state */
  state: T;
  /** Gets a property from the object */
  get: (key: keyof T) => T[keyof T];
  /** Merges a partial object into the state */
  merge: (newState: Partial<T>) => void;
  /** Removes a property from the object */
  remove: (key: keyof T) => void;
  /** Resets the object to its initial value */
  reset: () => void;
  /** Sets a property on the object */
  set: (key: keyof T, value: T[keyof T]) => void;
  /** Updates the object using an updater function */
  update: (updater: (prev: T) => T) => void;
}

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
export function useObject<T extends object>(initialValue: T): UseObjectReturn<T> {
  const [state, setState] = useState<T>(initialValue);

  const set = (key: keyof T, value: T[keyof T]) => {
    setState((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const get = (key: keyof T): T[keyof T] => {
    return state[key];
  };

  const reset = () => {
    setState(initialValue);
  };

  const update = (updater: (prev: T) => T) => {
    setState((prev) => updater(prev));
  };

  const merge = (newState: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      ...newState
    }));
  };

  const remove = (key: keyof T) => {
    setState((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest as T;
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
