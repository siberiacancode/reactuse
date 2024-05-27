import React from 'react';

/** The use rerender return type */
interface UseRerenderReturns {
  /** The id of the rerender */
  id: number;
  /** Function to rerender the component */
  update: () => void;
}

/**
 * @name useRerender
 * @description - Hook that defines the logic to force rerender a component
 *
 * @returns {UseRerenderReturns} An object containing the id and update function
 *
 * @example
 * const { id, update } = useRerender();
 */
export const useRerender = (): UseRerenderReturns => {
  const [value, setValue] = React.useState(0);
  return { id: value, update: () => setValue(Math.random()) };
};
