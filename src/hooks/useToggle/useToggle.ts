import type { SetStateAction } from 'react';
import { useReducer } from 'react';

/** The use toggle return type */
export type UseToggleReturn<Value> = readonly [Value, (value?: Value) => void];

/**
 * @name useToggle
 * @description - Hook that create toggle
 *
 * @template Value The type of the value
 * @param {Value[]} [values=[false, true]] The values to toggle
 *
 * @example
 * const [on, toggle] = useToggle();
 *
 * @example
 * const [value, toggle] = useToggle(['light', 'dark'] as const);
 */
export const useToggle = <Value = boolean>(values: readonly Value[] = [false, true] as any) => {
  const [[option], toggle] = useReducer((state: Value[], action: SetStateAction<Value>) => {
    const value = action instanceof Function ? action(state[0]) : action;
    const index = Math.abs(state.indexOf(value));
    return state.slice(index).concat(state.slice(0, index));
  }, values as Value[]);

  return [option, toggle as (value?: SetStateAction<Value>) => void] as const;
};
