import React from 'react';

/** The use counter options */
export interface UseCounterOptions {
  /** The min of count value */
  min?: number;
  /** The max of count value */
  max?: number;
}

export interface UseCounterParams {
  /** The initial number value, defaults to 0 */
  initialValue?: number;
  /** The min of count value */
  min?: number;
  /** The max of count value */
  max?: number;
}

/** The use counter return type */
export interface UseCounterReturn {
  /** The current count value */
  count: number;
  /** Function to set a specific value to the counter */
  set: React.Dispatch<React.SetStateAction<number>>;
  /** Function to reset the counter to its initial value. */
  reset: () => void;
  /** Function to increment the counter */
  inc: (value?: number) => void;
  /** Function to decrement the counter */
  dec: (value?: number) => void;
}

export type UseCounter = {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;

  ({ initialValue, max, min }: UseCounterParams, options?: never): UseCounterReturn;
};

/**
 * @name useCounter
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 *
 * @overload
 * @param {number} [initialValue=0] The initial number value
 * @param {UseCounterOptions} [useCounterOptions] The use counter options
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter

 * @overload
 * @param {UseCounterParams} [useCounterParams] The use counter params
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 */
export const useCounter: UseCounter = (...params) => {
  const initialValue = typeof params[0] === 'number' ? params[0] : params[0]?.initialValue;
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number' ? params[1] ?? {} : params[0] ?? {};

  const [count, setCount] = React.useState(initialValue ?? 0);

  React.useEffect(() => {}, [min, max]);

  const inc = (value: number = 1) => {
    setCount((prevCount) => {
      if (typeof max === 'number' && count === max) return prevCount;
      return Math.max(Math.min(max, prevCount + value), min);
    });
  };

  const dec = (value: number = 1) => {
    setCount((prevCount) => {
      if (typeof min === 'number' && prevCount === min) return prevCount;
      return Math.min(Math.max(min, prevCount - value), max);
    });
  };

  const reset = () => {
    const value = initialValue ?? 0;
    if (typeof max === 'number' && value > max) return setCount(max);
    if (typeof min === 'number' && value < min) return setCount(min);
    setCount(value);
  };

  const set = (value: React.SetStateAction<number>) => {
    setCount((prevCount) => {
      const updatedCount = Math.max(
        min,
        Math.min(max, typeof value === 'number' ? value : value(prevCount))
      );

      return updatedCount;
    });
  };

  return { count, set, inc, dec, reset } as const;
};
