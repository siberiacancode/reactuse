import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

/** The use counter options */
export interface UseCounterOptions {
  /** The max of count value */
  max?: number;
  /** The min of count value */
  min?: number;
}

/** The use counter return type */
export interface UseCounterReturn {
  /** Function to set a specific value to the counter */
  set: Dispatch<SetStateAction<number>>;
  /** The current count value */
  value: number;
  /** Function to decrement the counter */
  dec: (value?: number) => void;
  /** Function to increment the counter */
  inc: (value?: number) => void;
  /** Function to reset the counter to its initial value. */
  reset: () => void;
}

export interface UseCounter {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;

  (options: UseCounterOptions & { initialValue?: number }, initialValue?: never): UseCounterReturn;
}

/**
 * @name useCounter
 * @description - Hook that manages a counter
 * @category Utilities
 *
 * @overload
 * @param {number} [initialValue=0] The initial number value
 * @param {number} [options.min=Number.NEGATIVE_INFINITY] The min of count value
 * @param {number} [options.max=Number.POSITIVE_INFINITY] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter

 * @overload
 * @param {number} [params.initialValue=0] The initial number value
 * @param {number} [params.min=Number.NEGATIVE_INFINITY] The min of count value
 * @param {number} [params.max=Number.POSITIVE_INFINITY] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter({ initialValue: 5, min: 0, max: 10 });
 */
export const useCounter = ((...params: any[]) => {
  const initialValue =
    typeof params[0] === 'number'
      ? params[0]
      : (params[0] as UseCounterOptions & { initialValue?: number })?.initialValue;
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number'
      ? ((params[1] ?? {}) as UseCounterOptions)
      : ((params[0] ?? {}) as UseCounterOptions & { initialValue?: number });

  const [value, setValue] = useState(initialValue ?? 0);

  const inc = (value: number = 1) => {
    setValue((prevValue) => {
      if (typeof max === 'number' && prevValue === max) return prevValue;
      return Math.max(Math.min(max, prevValue + value), min);
    });
  };

  const dec = (value: number = 1) => {
    setValue((prevValue) => {
      if (typeof min === 'number' && prevValue === min) return prevValue;
      return Math.min(Math.max(min, prevValue - value), max);
    });
  };

  const reset = () => {
    const value = initialValue ?? 0;
    if (typeof max === 'number' && value > max) return setValue(max);
    if (typeof min === 'number' && value < min) return setValue(min);
    setValue(value);
  };

  const set = (value: SetStateAction<number>) => {
    setValue((prevValue) => {
      const updatedCount = Math.max(
        min,
        Math.min(max, typeof value === 'number' ? value : value(prevValue))
      );

      return updatedCount;
    });
  };

  return { value, set, inc, dec, reset };
}) as UseCounter;
