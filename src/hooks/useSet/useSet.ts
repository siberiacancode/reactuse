import React from 'react';

import { useRerender } from '../useRerender/useRerender';

export const useSet = <Value>(values: Value[]) => {
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
