import { useState } from 'react';

/** The use boolean return type */
export type UseBooleanReturn = [
  /** The current boolean state value */
  value: boolean,
  /** Function to toggle the boolean state */
  toggle: (value?: boolean) => void
];

/**
 * @name useBoolean
 * @description - Hook provides opportunity to manage boolean state
 * @category Utilities
 *
 * @param {boolean} [initialValue=false] The initial boolean value
 * @returns {UseBooleanReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const [on, toggle] = useBoolean()
 */
export const useBoolean = (initialValue = false): UseBooleanReturn => {
  const [value, setValue] = useState(initialValue);
  const toggle = (value?: boolean) => setValue((prevValue) => value ?? !prevValue);

  return [value, toggle];
};
