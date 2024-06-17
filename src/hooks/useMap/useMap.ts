import { useMemo, useState } from 'react';

type MapActions<K, V, R = any> = {
  /** Setter function to set new value in map */
  set: (key: K, value: V) => Map<K, V>;
  /** Function that returns boolean if given key exists in map or not */
  has: (key: K) => boolean;
  /** Delete function that deletes given key from map */
  delete: (key: K) => boolean;
  /** Function that clears map, deletes all elements and set size to 0 */
  clear: () => void;
  /** Mapper that can transform value and return the result to map it for UI */
  map: (mapper: (value: V, key: K) => R) => R[];
  /** Function that returns size of array */
  size: number;
};

/** The use boolean return type */
type UseMapReturn<K, V, R = any> = [
  /** Actual map structure with data */
  map: Map<K, V>,
  /** A list of actions to work with map */
  actions: MapActions<K, V, R>
];

/**
 * @name useMap
 * @description - Hook provides a map sctructure and some actions to work with given map
 *
 * @param {ReadonlyArray<readonly [K, V]>} initialValue The value to initialize map with
 * @returns {UseMapReturn} An object containing actions to work with map
 *
 * @example
 * const [map, actions] = useMap()
 */
export const useMap = <K, V>(intialValue?: ReadonlyArray<readonly [K, V]>): UseMapReturn<K, V> => {
  const [map] = useState(() => new Map(intialValue));
  const [size, setSize] = useState(map.size);

  const actions = useMemo(
    () => ({
      set(key: K, value: V) {
        const result = map.set(key, value);
        setSize(map.size);
        return result;
      },

      has(key: K) {
        return map.has(key);
      },

      delete(key: K) {
        const result = map.delete(key);
        setSize(map.size);
        return result;
      },

      clear() {
        map.clear();
        setSize(0);
      },

      map<R>(mapper: (value: V, key: K) => R) {
        const result: R[] = [];

        map.forEach((value, key) => {
          result.push(mapper(value, key));
        });

        return result;
      },

      get size() {
        return size;
      }
    }),
    [map, size]
  );

  return [map, actions] as const;
};
