import { useEffect, useRef } from 'react';
/**
 * @name useRenderCount
 * @description - Hook returns count component render times
 * @category Lifecycle
 *
 * @returns {number} A number which determines how many times component renders
 *
 * @example
 * const renderCount = useRenderCount();
 */
export const useRenderCount = () => {
  const renderCountRef = useRef(0);
  useEffect(() => {
    renderCountRef.current += 1;
  });
  return renderCountRef.current;
};
