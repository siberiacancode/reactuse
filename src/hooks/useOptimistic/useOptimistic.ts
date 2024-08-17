import { useEffect, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export type Primitive = boolean | string | number | symbol | bigint | undefined | null;

export type UseOptimisticOptions<S> = S extends Primitive
  ? { autoUpdate?: boolean }
  : { autoUpdate?: false };

export type AsyncUpdateOptimistic<O, S> = (optimisticValue: O) => Promise<S>;

export interface UpdateOptimistic<S, O> {
  (optimisticValue: O, promisedValue: Promise<S> | AsyncUpdateOptimistic<O, S>): Promise<S>;
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
export const useOptimistic = <S, O = S>(
  value: S,
  updateFn: (currentState: S, optimisticValue: O) => S,
  options?: UseOptimisticOptions<S>
): [S, UpdateOptimistic<S, O>] => {
  const [state, setState] = useState<S>(value);
  const handlerRef = useRef(updateFn);

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = updateFn;
  }, [updateFn]);

  const handleOptimisticUpdate = (optimisticValue: O) => {
    setState((currentState) => handlerRef.current(currentState, optimisticValue));
  };

  useEffect(() => {
    if (!options?.autoUpdate) return;
    setState(value);
  }, [value]);

  const updateState: UpdateOptimistic<S, O> = async (optimisticValue, promisedValue) => {
    handleOptimisticUpdate(optimisticValue);

    const updatedValue = await (typeof promisedValue === 'function'
      ? promisedValue(optimisticValue)
      : promisedValue);

    setState(updatedValue);

    return updatedValue;
  };

  return [state, updateState];
};
