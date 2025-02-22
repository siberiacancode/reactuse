import { useState } from 'react';
/**
 * @name useCounter
 * @description - Hook that manages a counter with increment, decrement, reset, and set functionalities
 * @category Utilities
 *
 * @overload
 * @param {number} [initialValue] The initial number value
 * @param {number} [options.min] The min of count value
 * @param {number} [options.max] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter

 * @overload
 * @param {number} [params.initialValue] The initial number value
 * @param {number} [params.min] The min of count value
 * @param {number} [params.max] The max of count value
 * @returns {UseCounterReturn} An object containing the current count and functions to interact with the counter
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter(5);
 *
 * @example
 * const { count, dec, inc, reset, set } = useCounter({ initialValue: 5, min: 0, max: 10 });
 */
export const useCounter = (...params) => {
  const initialValue = typeof params[0] === 'number' ? params[0] : params[0]?.initialValue;
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number' ? (params[1] ?? {}) : (params[0] ?? {});
  const [value, setValue] = useState(initialValue ?? 0);
  const inc = (value = 1) => {
    setValue((prevValue) => {
      if (typeof max === 'number' && prevValue === max) return prevValue;
      return Math.max(Math.min(max, prevValue + value), min);
    });
  };
  const dec = (value = 1) => {
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
  const set = (value) => {
    setValue((prevValue) => {
      const updatedCount = Math.max(
        min,
        Math.min(max, typeof value === 'number' ? value : value(prevValue))
      );
      return updatedCount;
    });
  };
  return { value, set, inc, dec, reset };
};
