import { useState } from 'react';
const normalizeIndex = (index, length) => ((index % length) + length) % length;
/**
 * @name useCycleList
 * @description - Hook that cycles through a list of items
 * @category State
 * @usage medium
 *
 * @template Value The type of the item
 * @param {Value[]} list The list of items to cycle through
 * @param {UseCycleListOptions<Value>} [options] The options for the hook
 * @returns {UseCycleListReturn<Value>} An object containing the current item, current index, and functions to cycle through the list
 *
 * @example
 * const { value, index, next, prev, go } = useCycleList(['Dog', 'Cat', 'Lizard']);
 */
export const useCycleList = (list, options = {}) => {
  const { initialValue = list[0], fallbackIndex = 0, getIndexOf } = options;
  const [index, setIndex] = useState(() => {
    if (!list.length) return 0;
    const index = getIndexOf ? getIndexOf(initialValue, list) : list.indexOf(initialValue);
    return index < 0 ? fallbackIndex : index;
  });
  const normalizedIndex = list.length ? normalizeIndex(index, list.length) : 0;
  const value = list[normalizedIndex];
  const go = (targetIndex) => {
    if (!list.length) {
      setIndex(0);
      return undefined;
    }
    const nextIndex = normalizeIndex(targetIndex, list.length);
    setIndex(nextIndex);
    return list[nextIndex];
  };
  const next = (step = 1) => go(normalizedIndex + step);
  const prev = (step = 1) => go(normalizedIndex - step);
  return { value, index: normalizedIndex, next, prev, go };
};
