import { useRef } from 'react';

/**
 * @name useConst
 * @description - Hook that returns the constant value
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {(() => Value) | Value} initialValue The initial value of the constant
 * @returns {Value} The constant value
 *
 * @example
 * const value = useConst('value');
 */
export const useConst = <Value>(initialValue: (() => Value) | Value) =>
  useRef<Value>(initialValue instanceof Function ? initialValue() : initialValue).current;
