import { useRef, useState } from 'react';

export interface UpdateOptimistic<Value> {
  (optimisticValue: Value, promise: Promise<any>): void;
}

/**
 * @name useOptimistic
 * @description Hook that allows get optimistic value before its update
 * @category Utilities
 *
 * @param {Any} value The value to be returned initially and whenever no action is pending
 * @param {Function} update A pure function that takes the current state and the optimistic value passed to updateOptimistic and returns the resulting optimistic state
 * @returns The resulting optimistic state, and the function to update it
 *
 * @example
 * const [optimisticState, updateOptimistic] = useOptimistic<number>(count, (currentState, optimisticValue) => currentState + optimisticValue);
 * ...
 * const someHandler = (value: number) => updateOptimistic(value, asyncAction(value));
 */
export const useOptimistic = <Value>(
  value: Value,
  update: (currentState: Value, optimisticValue: Value) => Value
): [Value, UpdateOptimistic<Value>] => {
  const [state, setState] = useState<Value>(value);
  const internalCallbackRef = useRef(update);
  internalCallbackRef.current = update;

  const updateState: UpdateOptimistic<Value> = (optimisticValue, promise) => {
    setState((currentState) =>
      internalCallbackRef.current(currentState, optimisticValue)
    );

    promise.then(() => setState(value));
  };

  return [state, updateState];
};
