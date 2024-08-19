import { useRef, useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

export type UseOptimisticReturn<State> = [
  State,
  (optimisticValue: State, promise: Promise<any>) => void
];

/**
 * @name useOptimistic
 * @description - Hook that allows get optimistic value before its update
 * @category Utilities
 *
 * @template State The type of the state
 * @param {State} state The value to be returned initially and whenever no action is pending
 * @param {(currentState: State, optimisticValue: State) => State} update A pure function that takes the current state and the optimistic value passed to updateOptimistic and returns the resulting optimistic state
 * @returns {UseOptimisticReturn<State>} The resulting optimistic state, and the function to update it
 *
 * @example
 * const [optimisticValue, updateOptimistic] = useOptimistic<number>(count, (currentState, optimisticValue) => currentState + optimisticValue);
 */
export const useOptimistic = <State>(
  externalState: State,
  update: (currentState: State, optimisticState: State) => State
) => {
  const [state, setState] = useState<State>(externalState);
  const internalCallbackRef = useRef(update);
  internalCallbackRef.current = update;

  const [promised, setPromised] = useState(false);

  useDidUpdate(() => {
    if (!promised) return;
    setState(externalState);
    setPromised(false);
  }, [externalState, promised]);

  const updateState = (optimisticValue: State, promise: Promise<any>) => {
    setState((currentState) => internalCallbackRef.current(currentState, optimisticValue));

    return promise.finally(() => setPromised(true));
  };

  return [state, updateState] as const;
};
