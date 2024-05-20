import React from 'react';

/**
 * @name useRenderCount
 * @description - Hook returns count component render times
 *
 * @returns {number} A number which determines how many times component renders
 *
 * @example
 * const renderCount = useRenderCount();
 */
export const useRenderCount = () => {
  const renderCountRef = React.useRef(0);

  React.useEffect(() => {
    renderCountRef.current += 1;
  });

  return renderCountRef.current;
};
