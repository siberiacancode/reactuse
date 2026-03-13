import { useCallback, useRef, useState } from 'react';

/** The use controllable state options type */
export interface UseControllableStateOptions<Value> {
  /** The initial value for uncontrolled state */
  initialValue?: Value;
  /** The controlled value */
  value?: Value;
  /** The onChange callback */
  onChange?: (value: Value) => void;
}

/** The use controllable state return type */
export type UseControllableStateReturn<Value> = [
  /** Current value */
  value: Value,
  /** Setter function that works with both controlled and uncontrolled state */
  setValue: (nextValue: ((prevValue: Value) => Value) | Value) => void,
  /** Whether the state is controlled */
  isControlled: boolean
];

/**
 * @name useControllableState
 * @description - Hook that manages both controlled and uncontrolled state patterns
 * @category State
 * @usage medium
 *
 * @template Value The type of the state value
 * @param {Value} [options.value] The controlled value. When provided, the component becomes controlled
 * @param {Value} [options.initialValue] The initial value for uncontrolled state
 * @param {(value: Value) => void} [options.onChange] The callback function called when the state changes
 * @returns {UseControllableStateReturn<Value>} A tuple containing the current value, setter function, and controlled flag
 *
 * @example
 * const [value, setValue, isControlled] = useControllableState({ initialValue: 'initial' });
 */
export function useControllableState<Value>(
  options: UseControllableStateOptions<Value>
): UseControllableStateReturn<Value> {
  const { value, initialValue, onChange } = options;
  const isControlled = value !== undefined;

  const [internalState, setInternalState] = useState<Value>(initialValue as Value);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentValue = isControlled ? value : internalState;

  const setValue = useCallback(
    (nextValue: ((prevValue: Value) => Value) | Value) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (prevValue: Value) => Value)(currentValue)
          : nextValue;

      if (!isControlled) setInternalState(resolvedValue);

      onChangeRef.current?.(resolvedValue);
    },
    [currentValue, isControlled]
  );

  return [currentValue, setValue, isControlled];
}
