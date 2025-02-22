import { useReducer } from 'react';
/**
 * @name useRerender
 * @description - Hook that defines the logic to force rerender a component
 * @category Lifecycle
 *
 * @returns {UseRerenderReturn} The rerender function
 *
 * @example
 * const rerender = useRerender();
 */
export const useRerender = () => {
  const rerender = useReducer(() => ({}), {})[1];
  return rerender;
};
