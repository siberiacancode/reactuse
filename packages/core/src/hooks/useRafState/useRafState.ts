import { useRef, useState } from 'react';

import { useUnmount } from '../useUnmount/useUnmount';

/* The use raf value params type */
export type UseRafStateReturn<Value> = [Value, (value: Value) => void];

/**
 * @name useRafState
 * @description - Hook that returns the value and a function to set the value
 * @category State
 *
 * @template Value The type of the value
 * @param {Value} initialValue The initial value
 * @returns {UseRafStateReturn<Value>} An array containing the value and a function to set the value
 *
 * @example
 * const [value, setValue] = useRafState(initialValue);
 */
export const useRafState = <Value>(initialValue: (() => Value) | Value) => {
  const rafIdRef = useRef(0);
  const [value, setValue] = useState(initialValue);

  const set = (value: Value) => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => setValue(value));
  };

  useUnmount(() => cancelAnimationFrame(rafIdRef.current));

  return [value, set] as const;
};
