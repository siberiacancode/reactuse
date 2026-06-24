import { useEffect, useState } from 'react';

/** The use cycle list options type */
export interface UseCycleListOptions<T> {
  defaultIndex?: number;
  /** The initial value of the state. Use strict equality for compare */
  initialValue?: T;
  /** Enable cyclic navigation.
   *  @default true
   */
  loop?: boolean;
}

/** The use cycle list return type */
export interface UseCycleListReturn<T> {
  /** Current list item index */
  index: number;
  /** Current list item */
  value: T | undefined;
  /** Go to a specific index */
  go: (i: number) => void;
  /** Go to a next item */
  next: (step?: number) => void;
  /** Go to a prev item */
  prev: (step?: number) => void;
}

const isInteger = (value?: number): value is number =>
  typeof value === 'number' &&
  !Number.isNaN(value) &&
  Number.isFinite(value) &&
  Number.isInteger(value);

const normalizeIndex = (index: number, length: number) => {
  if (length <= 0) return 0;

  return ((index % length) + length) % length;
};

const clampIndex = (index: number, length: number) => {
  if (length <= 0) return 0;

  return Math.min(Math.max(index, 0), length - 1);
};

const getInitialIndex = <T>(list: T[], options: UseCycleListOptions<T>, loop: boolean) => {
  const length = list.length;

  if (length === 0) return 0;

  if (isInteger(options.defaultIndex)) {
    return loop
      ? normalizeIndex(options.defaultIndex, length)
      : clampIndex(options.defaultIndex, length);
  }

  if ('initialValue' in options) {
    const foundIndex = list.findIndex((item) => item === options.initialValue);

    return foundIndex >= 0 ? foundIndex : 0;
  }

  return 0;
};

const getIndex = (index: number, length: number, loop: boolean) =>
  loop ? normalizeIndex(index, length) : clampIndex(index, length);

/**
 * @name useCycleList
 * @description - Hook that cycle through a list of items
 * @category State
 * @usage low
 *
 * @param {T[]} list The list that needs to be iterated over
 * @param {number} [options.defaultIndex] The starting index to be used instead of zero. Takes precedence over initialValue
 * @param {T} [options.initialValue] The index of the passed element will be used as the starting index
 * @param {boolean} [options.loop] A flag that controls whether the list stops at the edges
 * @returns {UseCycleListReturn} An object containing the current index, value and functions to interact with the list
 *
 * @example
 * const { value, index, next, prev, go } = useCycleList([
 *   'AC/DC',
 *   'Metallica',
 *   'Skillet',
 *   'Linkin Park',
 *   'Nirvana',
 *   'Muse',
 * ])
 *
 * @example
 * const { value, index, next, prev, go } = useCycleList([
 *   'AC/DC',
 *   'Metallica',
 *   'Skillet',
 *   'Linkin Park',
 *   'Nirvana',
 *   'Muse',
 * ], {defaultIndex: 2, loop: false})
 *
 */
export const useCycleList = <T>(
  list: T[],
  { loop = true, ...options }: UseCycleListOptions<T> = {}
): UseCycleListReturn<T> => {
  const [index, setIndex] = useState(() => getInitialIndex(list, options, loop));

  const safeIndex = getIndex(index, list.length, loop);
  const value = list[safeIndex];

  const next = (step = 1) => {
    if (!isInteger(step) || list.length === 0) return;

    setIndex((currentIndex) => {
      const nextIndex = currentIndex + step;

      return getIndex(nextIndex, list.length, loop);
    });
  };

  const prev = (step = 1) => {
    if (!isInteger(step) || list.length === 0) return;

    setIndex((currentIndex) => {
      const nextIndex = currentIndex - step;

      return getIndex(nextIndex, list.length, loop);
    });
  };

  const go = (nextIndex: number) => {
    if (!isInteger(nextIndex) || list.length === 0) return;

    setIndex(getIndex(nextIndex, list.length, loop));
  };

  useEffect(() => {
    setIndex((currentIndex) => getIndex(currentIndex, list.length, loop));
  }, [list.length, loop]);

  return { value, index: safeIndex, next, prev, go };
};
