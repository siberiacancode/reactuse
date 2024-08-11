import { useEffect, useState } from 'react';

export interface UseOptimisticOptions<S> {
  onUpdate?: (updatedValue: S, currentValue: S) => S;
  isPrimitive?: boolean;
}

/**
 * @name useOptimistic
 * @description Hook that allows get optimistic value before its update
 * @category Utilities
 *
 * @param {Number} delay Actual/initial value
 * @param {UseOptimisticOptions} options Options of provided value update
 * @returns {Object} { value, update } - Optimistic value and the method for updating it
 *
 * @example
 * const { value, update } = useOptimistic(400, { onUpdate: (updated, current) => updated + current });
 * ...
 * update(300, new Promise((resolve) => resolve(300)));
 */
export const useOptimistic = <S>(externalValue: S, options: UseOptimisticOptions<S> = {}) => {
  const [value, setValue] = useState<S>(externalValue);

  useEffect(() => {
    if (!options.isPrimitive) return;
    setValue(externalValue);
  }, [externalValue]);

  const handleUpdate = (updatedValue: S) => {
    setValue((currentValue) => {
      if (!options.onUpdate) return updatedValue;
      return options.onUpdate(updatedValue, currentValue);
    });
  };

  const update = async <T>(
    optimisticValue: S,
    promise: Promise<T extends S ? S : T>,
    selector?: (value: T extends S ? S : T) => S
  ): Promise<void> => {
    handleUpdate(optimisticValue);

    const updatedValue = await promise;

    handleUpdate(selector ? selector(updatedValue) : (updatedValue as S));
  };

  return { value, update };
};
