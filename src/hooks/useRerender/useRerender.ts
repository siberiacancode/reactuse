import React from 'react';

/** The use rerender return type */
interface UseRerenderReturns {
  /** The id of the rerender */
  id: string;
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
  const id = React.useId();
  const [value, setValue] = React.useState(id);
  return { id: value, update: () => setValue(Math.random().toString()) };
};
