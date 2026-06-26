import { useState } from 'react';

/** The use cycle list return type */
export interface UseCycleListReturn<Value> {
  /** The current index */
  index: number;
  /** The current item */
  value: Value;
  /** Go to a specific index in the list */
  go: (index: number) => Value;
  /** Go to the next item by step */
  next: (step?: number) => Value;
  /** Go to the previous item by step */
  prev: (step?: number) => Value;
}

const normalizeIndex = (index: number, length: number) => ((index % length) + length) % length;

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
export const useCycleList = <Value>(list: Value[], initialIndex = 0): UseCycleListReturn<Value> => {
  const [index, setIndex] = useState(() => normalizeIndex(initialIndex, list.length));

  const normalizedIndex = normalizeIndex(index, list.length);
  const value = list[normalizedIndex];

  const go = (targetIndex: number) => {
    const nextIndex = normalizeIndex(targetIndex, list.length);
    setIndex(nextIndex);

    return list[nextIndex];
  };

  const next = (step = 1) => go(normalizedIndex + step);

  const prev = (step = 1) => go(normalizedIndex - step);

  return { value, index: normalizedIndex, next, prev, go };
};
