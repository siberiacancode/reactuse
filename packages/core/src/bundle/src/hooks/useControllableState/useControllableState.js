import { useCallback, useRef, useState } from 'react';
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
export function useControllableState(options) {
  const { value, initialValue, onChange } = options;
  const isControlled = value !== undefined;
  const [internalState, setInternalState] = useState(initialValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const currentValue = isControlled ? value : internalState;
  const setValue = useCallback(
    (nextValue) => {
      const resolvedValue = typeof nextValue === 'function' ? nextValue(currentValue) : nextValue;
      if (!isControlled) setInternalState(resolvedValue);
      onChangeRef.current?.(resolvedValue);
    },
    [currentValue, isControlled]
  );
  return [currentValue, setValue, isControlled];
}
