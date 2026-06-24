import { useEffect, useState } from 'react';
const isInteger = (value) =>
  typeof value === 'number' &&
  !Number.isNaN(value) &&
  Number.isFinite(value) &&
  Number.isInteger(value);
const normalizeIndex = (index, length) => {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
};
const clampIndex = (index, length) => {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
};
const getInitialIndex = (list, options, loop) => {
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
const getIndex = (index, length, loop) =>
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
export const useCycleList = (list, { loop = true, ...options } = {}) => {
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
  const go = (nextIndex) => {
    if (!isInteger(nextIndex) || list.length === 0) return;
    setIndex(getIndex(nextIndex, list.length, loop));
  };
  useEffect(() => {
    setIndex((currentIndex) => getIndex(currentIndex, list.length, loop));
  }, [list.length, loop]);
  return { value, index: safeIndex, next, prev, go };
};
