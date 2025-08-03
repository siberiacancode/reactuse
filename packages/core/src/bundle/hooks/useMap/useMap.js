import { useState } from 'react';
/**
 * @name useMap
 * @description - Hook that manages a map structure
 * @category State
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the map
 * @returns {UseMapReturn<Key, Value>} An object containing the current map and functions to interact with the map
 *
 * @example
 * const { value, set, remove, clear, reset, size, has } = useMap([1, 'one'], [2, 'two']);
 */
export const useMap = (values) => {
  const [map, setMap] = useState(new Map(values));
  const set = (key, value) => setMap((prevMap) => new Map(prevMap).set(key, value));
  const remove = (key) =>
    setMap((prevMap) => {
      if (!prevMap.has(key)) return prevMap;
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
  const clear = () => setMap(new Map());
  const reset = () => setMap(new Map(values));
  const has = (key) => map.has(key);
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
