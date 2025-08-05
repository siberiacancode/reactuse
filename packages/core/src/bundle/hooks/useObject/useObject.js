import { useState } from 'react';
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
export function useObject(initialValue) {
  const [value, setValue] = useState(initialValue);
  const set = (value) =>
    setValue((prevValue) => ({
      ...prevValue,
      ...value
    }));
  const reset = () => setValue(initialValue);
  const remove = (key) => {
    if (!(key in value)) return;
    setValue((prevValue) => {
      const { [key]: _, ...rest } = prevValue;
      return rest;
    });
  };
  const clear = () => setValue({});
  const has = (key) => key in value;
  const keys = Object.keys(value);
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
