import { useState } from 'react';

export interface StateRef<Value> {
  (node: Value): void;
  current: Value;
  state?: Value;
}

const createRefState = <Value>(
  initialValue: Value | undefined,
  setState: (value: Value) => void
) => {
  let temp = initialValue;
  function ref(value: Value) {
    if (temp === value) return;
    temp = value;
    setState(temp);
  }

  Object.defineProperty(ref, 'current', {
    get() {
      return temp;
    },
    set(value: Value) {
      if (temp === value) return;
      temp = value;
      setState(temp);
    },
    configurable: true,
    enumerable: true
  });

  return ref as StateRef<Value>;
};

/**
 * @name useRefState
 * @description - Hook that returns the state reference of the value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value} [initialValue] The initial value
 * @returns {StateRef<Value>} The current value
 *
 * @example
 * const internalRefState = useRefState();
 */
export const useRefState = <Value>(initialValue?: Value) => {
  const [state, setState] = useState<Value | undefined>(initialValue);
  const [ref] = useState(() => createRefState<Value>(initialValue, setState));
  ref.state = state;
  return ref;
};
