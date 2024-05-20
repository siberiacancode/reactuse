import React from 'react';

/** The use boolean return type */
type UseBooleanReturn = [
  /** The current boolean state value */
  value: boolean,
  /** Function to toggle the boolean state */
  toggle: (value?: boolean) => void
];

/**
 * @name useBoolean
 * @description - Hook provides a boolean state and a function to toggle the boolean value
 *
 * @param {boolean} [initialValue=false] The initial boolean value
 * @returns {UseBooleanReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const [on, toggle] = useBoolean()
 */

export const useBoolean = (initialValue = false): UseBooleanReturn => {
  const [value, setValue] = React.useState(initialValue);
  const toggle = (value?: boolean) => setValue((prev) => value ?? !prev);

  return [value, toggle];
};
