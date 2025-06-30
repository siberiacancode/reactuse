import type { RefObject } from 'react';

import { useMemo, useRef } from 'react';

export interface UseLatestReturn<Value> {
  ref: RefObject<Value>;
  value: Value;
}

/**
 * @name useLatest
 * @description - Hook that returns the stable reference of the value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @returns {UseLatestReturn<Value>} The previous value
 *
 * @example
 * const { value, ref } = useLatest(value);
 */
export const useLatest = <Value>(value: Value): UseLatestReturn<Value> => {
  const valueRef = useRef<Value>(value);
  valueRef.current = value;
  return useMemo(
    () => ({
      get value() {
        return valueRef.current;
      },
      ref: valueRef
    }),
    []
  );
};
