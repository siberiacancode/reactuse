import { useMemo, useState } from 'react';

export const useMap = <K, V>(intialValue?: ReadonlyArray<readonly [K, V]>) => {
  const [map] = useState(() => new Map(intialValue));
  const [size, setSize] = useState(map.size);

  return useMemo(
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
};
