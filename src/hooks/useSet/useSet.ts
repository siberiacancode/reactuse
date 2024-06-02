import React from 'react';

import { useRerender } from '../useRerender/useRerender';

/**
 * @name useSet
 * @description - Hook that manages a set structure
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {Set<Value>} A set structure
 *
 * @example
 * const set = useSet([1, 2, 3]);
 */
export const useSet = <Value>(values?: Value[]) => {
  const setRef = React.useRef(new Set(values));
  const rerender = useRerender();

  setRef.current.add = (...args) => {
    const result = Set.prototype.add.apply(setRef.current, args);
    rerender.update();
    return result;
  };

  setRef.current.clear = (...args) => {
    Set.prototype.clear.apply(setRef.current, args);
    rerender.update();
  };

  setRef.current.delete = (...args) => {
    const result = Set.prototype.delete.apply(setRef.current, args);
    rerender.update();
    return result;
  };

  return setRef.current;
};
