import { useEffect, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export type Primitive = boolean | string | number | symbol | bigint | undefined | null;

export type UseOptimisticOptions<State> = State extends Primitive
  ? { autoUpdate?: boolean }
  : { autoUpdate?: false };

export type AsyncOptimisticStateUpdateAction<Optimistic, State> = (
  optimisticValue: Optimistic
) => Promise<State>;

export interface UpdateOptimistic<State, Optimistic> {
  (
    optimisticValue: Optimistic,
    promisedValue: Promise<State> | AsyncOptimisticStateUpdateAction<Optimistic, State>
  ): Promise<State>;
}

/**
 * @name useOptimistic
 * @description Hook that allows get optimistic value before its update
 * @category Utilities
 *
 * @param {Any} value The value to be returned initially and whenever no action is pending
 * @param {Function} updateFn A pure function that takes the current state and the optimistic value passed to updateOptimistic and returns the resulting optimistic state
 * @param {UseOptimisticOptions<Any>} options Options of optimistic state update
 * @returns The resulting optimistic state, and the function to update it
 *
 * @example
 * const [optimisticState, updateOptimistic] = useOptimistic<Item[], Item>([], (currentState, optimisticValue) => [...currentState, optimisticValue]);
 * ...
 * const asyncAction = async (optimisticValue: Item) => {
 *   const response = await request(optimisticValue);
 *   const result = await response.json();
 *   return result.items;
 * };
 * ...
 * const addItem = (newItem: Item) => updateOptimistic(newItem, asyncAction);
 */
export const useOptimistic = <State, Optimistic = State>(
  value: State,
  updateFn: (currentState: State, optimisticValue: Optimistic) => State,
  options?: UseOptimisticOptions<State>
): [State, UpdateOptimistic<State, Optimistic>] => {
  const [state, setState] = useState<State>(value);
  const handlerRef = useRef(updateFn);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = updateFn;
  }, [updateFn]);

  const handleOptimisticUpdate = (optimisticValue: Optimistic) => {
    setState((currentState) => handlerRef.current(currentState, optimisticValue));
  };

  useEffect(() => {
    if (!options?.autoUpdate) return;
    setState(value);
  }, [value]);

  const updateState: UpdateOptimistic<State, Optimistic> = async (
    optimisticValue,
    promisedValue
  ) => {
    handleOptimisticUpdate(optimisticValue);

    const updatedValue = await (typeof promisedValue === 'function'
      ? promisedValue(optimisticValue)
      : promisedValue);

    setState(updatedValue);

    return updatedValue;
  };

  return [state, updateState];
};
