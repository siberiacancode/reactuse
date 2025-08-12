import { useState } from 'react';

/**
 * @name useDefault
 * @description - Hook that returns the default value
 * @category State
 * @usage medium

 * @template Value The type of the value
 * @param {Value} initialValue The initial value
 * @param {Value} defaultValue The default value
 * @returns {[Value, (value: Value) => void]} An array containing the current value and a function to set the value
 *
 * @example
 * const [value, setValue] = useDefault(initialValue, defaultValue);
 */
export const useDefault = <Value>(initialValue: (() => Value) | Value, defaultValue: Value) => {
  const [value, setValue] = useState<Value | null | undefined>(initialValue);
  return [value === undefined || value === null ? defaultValue : value, setValue] as const;
};
