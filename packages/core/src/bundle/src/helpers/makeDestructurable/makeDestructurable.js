/**
 * @name makeDestructurable
 * @description - Makes an object also iterable for array-style destructuring
 * @category Helpers
 * @usage low
 *
 * @template Object - The object shape
 * @template Array - The tuple/array shape for destructuring
 * @param {object} obj - Object part of the returned value
 * @param {Array} arr - Iterable tuple/array part of the returned value
 * @returns {object & Array} Combined object that supports both object and array destructuring
 *
 * @example
 * const result = makeDestructurable({ x: 10, y: 20 }, [10, 20] as const);
 */
export const makeDestructurable = (obj, arr) => {
  if (typeof Symbol !== 'undefined') {
    const clone = { ...obj };
    Object.defineProperty(clone, Symbol.iterator, {
      enumerable: false,
      value() {
        let index = 0;
        return {
          next: () => ({
            value: arr[index++],
            done: index > arr.length
          })
        };
      }
    });
    return clone;
  }
  return Object.assign([...arr], obj);
};
