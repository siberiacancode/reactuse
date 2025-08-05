import { useState } from 'react';

/** The use object return type */
export interface UseObjectReturn<Value extends object> {
  /** Checks if the object is empty */
  empty: boolean;
  /** Gets the keys of the object */
  keys: Array<keyof Value>;
  /** Gets the number of properties */
  size: number;
  /** The current object state */
  value: Value;
  /** Clears all properties from the object */
  clear: () => void;
  /** Checks if a property exists */
  has: (key: keyof Value) => boolean;
  /** Removes a property from the object */
  remove: (key: keyof Value) => void;
  /** Resets the object to its initial value */
  reset: () => void;
  /** Sets a property on the object */
  set: (value: Partial<Value>) => void;
}

/**
 * @name useObject
 * @description - Hook that provides state and helper methods to manage an object
 * @category State
 *
 * @template Value The type of the object
 * @param {Value} initialValue The initial object value
 * @returns {UseObjectReturn<Value>} An object containing the current state and functions to interact with the object
 *
 * @example
 * const { value, set, reset, remove, update, merge, clear, toggle, has, keys, isEmpty, size } = useObject({ name: 'John', age: 30, isActive: true });
 */
export function useObject<Value extends object>(initialValue: Value): UseObjectReturn<Value> {
  const [value, setValue] = useState<Value>(initialValue);

  const set = (value: Partial<Value>) =>
    setValue((prevValue) => ({
      ...prevValue,
      ...value
    }));

  const reset = () => setValue(initialValue);

  const remove = (key: keyof Value) => {
    if (!(key in value)) return;

    setValue((prevValue) => {
      const { [key]: _, ...rest } = prevValue;
      return rest as Value;
    });
  };

  const clear = () => setValue({} as Value);

  const has = (key: keyof Value) => key in value;

  const keys = Object.keys(value) as Array<keyof Value>;
  const empty = !Object.keys(value).length;
  const size = Object.keys(value).length;

  return {
    value,
    set,
    reset,
    remove,
    clear,
    has,
    keys,
    empty,
    size
  };
}
