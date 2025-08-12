import { useRef } from 'react';
/**
 * @name useConst
 * @description - Hook that returns the constant value
 * @category Utilities
 * @usage high

 * @template Value The type of the value
 * @param {(() => Value) | Value} initialValue The initial value of the constant
 * @returns {Value} The constant value
 *
 * @example
 * const value = useConst('value');
 */
export const useConst = (initialValue) =>
  useRef(typeof initialValue === 'function' ? initialValue() : initialValue).current;
