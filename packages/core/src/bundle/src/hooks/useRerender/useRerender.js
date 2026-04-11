import { useReducer } from 'react';
/**
 * @name useRerender
 * @description - Hook that defines the logic to force rerender a component
 * @category Debug
 * @usage medium
 *
 * @returns {UseRerenderReturn} The rerender function
 *
 * @example
 * const rerender = useRerender();
 */
export const useRerender = () => useReducer(() => ({}), {})[1];
