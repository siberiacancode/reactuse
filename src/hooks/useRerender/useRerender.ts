import { useId, useState } from 'react';

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
 * @category Component
 *
 * @returns {UseRerenderReturns} An object containing the id and update function
 *
 * @example
 * const { id, update } = useRerender();
 */
export const useRerender = (): UseRerenderReturns => {
  const id = useId();
  const [value, setValue] = useState(id);
  return { id: value, update: () => setValue(Math.random().toString()) };
};
