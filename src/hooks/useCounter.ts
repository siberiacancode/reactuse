import React from 'react';

export interface UseCounterOptions {
  min?: number;
  max?: number;
}
export interface UseCounterReturn {
  count: number;
  set: (value: number) => void;
  reset: (value?: number) => void;
  inc: (value?: number) => void;
  dec: (value?: number) => void;
}

export type UseCounter = {
  (initialValue?: number, options?: UseCounterOptions): UseCounterReturn;
  (
    { initialValue, max, min }: { initialValue?: number } & UseCounterOptions,
    options?: never
  ): UseCounterReturn;
};

export const useCounter: UseCounter = (...params) => {
  const initialValue = typeof params[0] === 'number' ? params[0] : params[0]?.initialValue;
  const { max = Number.POSITIVE_INFINITY, min = Number.NEGATIVE_INFINITY } =
    typeof params[0] === 'number' ? params[1] ?? {} : params[0] ?? {};

  const [count, setCount] = React.useState(initialValue ?? min ?? 0);

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

  const reset = (value: number = initialValue ?? 0) => {
    if (typeof max === 'number' && value > max) return setCount(max);
    if (typeof min === 'number' && value < min) return setCount(min);
    setCount(value);
  };

  const set = (value: number) => setCount(Math.max(min, Math.min(max, value)));

  return { count, set, inc, dec, reset } as const;
};
