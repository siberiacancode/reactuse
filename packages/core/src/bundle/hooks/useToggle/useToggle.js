import { useReducer } from 'react';
/**
 * @name useToggle
 * @description - Hook that create toggle
 * @category Utilities
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
export const useToggle = (values = [false, true]) => {
  const [[option], toggle] = useReducer((state, action) => {
    const value = typeof action === 'function' ? action(state[0]) : action;
    const index = Math.abs(state.indexOf(value));
    return state.slice(index).concat(state.slice(0, index));
  }, values);
  return [option, toggle];
};
