import { useState } from 'react';

export interface UseValidatedStateValue<T> {
  /** Last valid value */
  lastValidValue: T | undefined;

  /** True if the current value is valid, false otherwise */
  valid: boolean;

  /** Current value */
  value: T;
}

export type UseValidatedStateReturnValue<T> = [
  /** Current value */
  UseValidatedStateValue<T>,
  /** Handler to update the state, passes `value` and `payload` to `onChange` */
  (value: T) => void
];

/**
 * @name useValidatedState
 * @description - Hook that manages a state value together with its validation result
 * @category State
 * @usage medium
 *
 * @template T The state value type
 * @param {T} initialValue The initial state value
 * @param {(value: T) => boolean} validate Function that validates the state value
 * @param {boolean} [initialValidationState] Optional initial validity state
 * @returns {UseValidatedStateReturnValue<T>} The state data and update function
 *
 * @example
 * const [state, setValue] = useValidatedState('', (value) => value.length >= 3);
 */
export function useValidatedState<T>(
  initialValue: T,
  validate: (value: T) => boolean,
  initialValidationState?: boolean
): UseValidatedStateReturnValue<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [lastValidValue, setLastValidValue] = useState<T | undefined>(() =>
    validate(initialValue) ? initialValue : undefined
  );
  const [valid, setValid] = useState<boolean>(() =>
    typeof initialValidationState === 'boolean' ? initialValidationState : validate(initialValue)
  );

  const onChange = (value: T) => {
    if (validate(value)) {
      setLastValidValue(value);
      setValid(true);
    } else {
      setValid(false);
    }

    setValue(value);
  };

  return [{ lastValidValue, valid, value }, onChange] as const;
}
