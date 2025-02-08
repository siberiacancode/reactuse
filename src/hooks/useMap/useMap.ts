import { useState } from 'react';

/** The use map return type */
export interface UseMapReturn<Key, Value> {
  /** The size of the map */
  size: number;
  /** The current map */
  value: Map<Key, Value>;
  /** Function to clear the map */
  clear: () => void;
  /** Function to check if a value exists in the map */
  has: (key: Key) => boolean;
  /** Function to remove a value from the map */
  remove: (key: Key) => void;
  /** Function to toggle a value in the map */
  reset: () => void;
  /** Function to add a value to the map */
  set: (key: Key, value: Value) => void;
}

/**
 * @name useMap
 * @description - Hook that manages a map structure
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the map
 * @returns {UseMapReturn<Key, Value>} An object containing the current map and functions to interact with the map
 *
 * @example
 * const { value, set, remove, clear, reset, size, has } = useMap([1, 'one'], [2, 'two']);
 */
export const useMap = <Key, Value>(values?: [Key, Value][]): UseMapReturn<Key, Value> => {
  const [map, setMap] = useState(new Map(values));

  const set = (key: Key, value: Value) => setMap((prevMap) => new Map(prevMap).set(key, value));
  const remove = (key: Key) =>
    setMap((prevMap) => {
      if (!prevMap.has(key)) return prevMap;
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  const clear = () => setMap(new Map());
  const reset = () => setMap(new Map(values));
  const has = (key: Key) => map.has(key);

  return {
    value: map,
    size: map.size,
    set,
    has,
    remove,
    clear,
    reset
  };
};
