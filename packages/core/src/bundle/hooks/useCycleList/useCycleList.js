import { useState } from 'react';
const normalizeIndex = (index, length) => ((index % length) + length) % length;
/**
 * @name useCycleList
 * @description - Hook that cycles through a list of items
 * @category State
 * @usage medium
 *
 * @template Value The type of the item
 * @param {[Value, ...Value[]]} list The non-empty list of items to cycle through
 * @param {number} [initialIndex=0] The initial index in the list
 * @returns {UseCycleListReturn<Value>} An object containing the current item, current index, and functions to cycle through the list
 *
 * @example
 * const { value, index, next, prev, go } = useCycleList(['Dog', 'Cat', 'Lizard']);
 */
export const useCycleList = (list, initialIndex = 0) => {
  const [index, setIndex] = useState(() => normalizeIndex(initialIndex, list.length));
  const normalizedIndex = normalizeIndex(index, list.length);
  const value = list[normalizedIndex];
  const go = (targetIndex) => {
    const nextIndex = normalizeIndex(targetIndex, list.length);
    setIndex(nextIndex);
    return list[nextIndex];
  };
  const next = (step = 1) => go(normalizedIndex + step);
  const prev = (step = 1) => go(normalizedIndex - step);
  return { value, index: normalizedIndex, next, prev, go };
};
