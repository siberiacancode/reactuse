import React from 'react';

/**
 * @name usePrevious
 * @description - Hook that returns the previous value
 *
 * @template Value The type of the value
 * @param {Value} value The value to get the previous value
 * @returns {Value} The previous value
 *
 * @example
 * const prevValue = usePrevious(value);
 */
export const usePrevious = <Value>(value: Value) => {
  const ref = React.useRef<Value>(value);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
