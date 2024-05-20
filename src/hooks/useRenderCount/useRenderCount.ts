import React from 'react';

/** The use render count return type */
/* The number component render times */
type UseRenderCountReturn = number;

/**
 * Hook returns count component render times
 *
 * @returns {UseRenderCountReturn} A number which determines how many times component renders
 */
export const useRenderCount = (): UseRenderCountReturn => {
  const renderCount = React.useRef(0);

  React.useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount.current;
};
