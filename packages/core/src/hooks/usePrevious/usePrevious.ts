import { useRef } from 'react';

export interface UsePreviousOptions<Value> {
  equality: (a: Value, b: Value) => boolean;
}

/**
 * @name usePrevious
 * @description - Hook that returns the previous value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @param {(a: Value, b: Value) => boolean} [options.equality] The custom equality function to determine if the value has changed
 * @returns {Value | undefined} The previous value
 *
 * @example
 * const prevValue = usePrevious(value);
 */
export const usePrevious = <Value>(value: Value, options?: UsePreviousOptions<Value>) => {
  const currentRef = useRef<Value>(value);
  const previousRef = useRef<Value>(undefined);

  const equality = options?.equality ?? Object.is;

  if (!equality(value, currentRef.current)) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
};
