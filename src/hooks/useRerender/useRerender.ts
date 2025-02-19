import { useReducer } from 'react';

/** The use rerender return type */
type UseRerenderReturn = () => void;

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
export const useRerender = (): UseRerenderReturn => {
  const rerender = useReducer(() => ({}), {})[1];
  return rerender;
};
