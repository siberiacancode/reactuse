import { useState } from 'react';

/** The use cycle list options type */
export interface UseCycleListOptions<Value> {
  /** The fallback index if the initial value is not found in the list */
  fallbackIndex?: number;
  /** The initial value */
  initialValue?: Value;
  /** The function to get the index of the initial value */
  getIndexOf?: (value: Value, list: Value[]) => number;
}

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
 * @param {Value[]} list The list of items to cycle through
 * @param {UseCycleListOptions<Value>} [options] The options for the hook
 * @returns {UseCycleListReturn<Value>} An object containing the current item, current index, and functions to cycle through the list
 *
 * @example
 * const { value, index, next, prev, go } = useCycleList(['Dog', 'Cat', 'Lizard']);
 */
export const useCycleList = <Value>(
  list: Value[],
  options: UseCycleListOptions<Value> = {}
): UseCycleListReturn<Value> => {
  const { initialValue = list[0], fallbackIndex = 0, getIndexOf } = options;

  const [index, setIndex] = useState(() => {
    if (!list.length) return 0;

    const index = getIndexOf ? getIndexOf(initialValue, list) : list.indexOf(initialValue);

    return index < 0 ? fallbackIndex : index;
  });

  const normalizedIndex = list.length ? normalizeIndex(index, list.length) : 0;
  const value = list[normalizedIndex];

  const go = (targetIndex: number) => {
    if (!list.length) {
      setIndex(0);
      return undefined as Value;
    }

    const nextIndex = normalizeIndex(targetIndex, list.length);
    setIndex(nextIndex);

    return list[nextIndex];
  };

  const next = (step = 1) => go(normalizedIndex + step);

  const prev = (step = 1) => go(normalizedIndex - step);

  return { value, index: normalizedIndex, next, prev, go };
};
