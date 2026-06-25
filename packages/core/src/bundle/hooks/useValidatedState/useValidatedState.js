import { useState } from 'react';
/**
 * @name useValidatedState
 * @description - Hook that manages a state value together with its validation result
 * @category State
 * @usage medium
 *
 * @template Value The type of the state value
 * @param {Value} initialValue The initial state value
 * @param {(value: Value) => boolean} validate Function that validates the state value
 * @param {boolean} [initialValidationState] Optional initial validity state
 * @returns {UseValidatedStateReturn<Value>} A tuple containing the current state object and setter function
 *
 * @example
 * const [{ value, lastValidValue, valid }, setValue] = useValidatedState(
 *   '',
 *   (value) => value.length >= 3
 * );
 */
export const useValidatedState = (initialValue, validate, initialValidationState) => {
  const [state, setState] = useState(() => {
    const isValid = validate(initialValue);
    return {
      value: initialValue,
      lastValidValue: isValid ? initialValue : undefined,
      valid: typeof initialValidationState === 'boolean' ? initialValidationState : isValid
    };
  });
  const setValidatedValue = (value) => {
    setState((previousState) => {
      const isValid = validate(value);
      return {
        value,
        valid: isValid,
        lastValidValue: isValid ? value : previousState.lastValidValue
      };
    });
  };
  return [state, setValidatedValue];
};
