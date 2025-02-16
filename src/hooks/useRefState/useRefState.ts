import { useRef } from 'react';

import { useRerender } from '../useRerender/useRerender';

export interface StateRef<Value> {
  (node: Value): void;
  current: Value;
}

const createRefState = <Value>(initialValue: Value | undefined, rerender: () => void) => {
  let temp = initialValue;
  function ref(value: Value) {
    temp = value;
    rerender();
  }

  Object.defineProperty(ref, 'current', {
    get() {
      return temp;
    },
    set(value: Value) {
      rerender();
      temp = value;
    },
    configurable: true,
    enumerable: true
  });

  return ref as StateRef<Value>;
};

/**
 * @name useRefState
 * @description - Hook that returns the state reference of the value
 * @category Lifecycle
 *
 * @template Value The type of the value
 * @param {Value} [initialValue] The initial value
 * @returns {StateRef<Value>} The current value
 *
 * @example
 * const internalRefState = useRefState();
 */
export const useRefState = <Value>(initialValue?: Value) => {
  const rerender = useRerender();
  const ref = useRef(createRefState<Value>(initialValue, rerender));

  return ref.current;
};
