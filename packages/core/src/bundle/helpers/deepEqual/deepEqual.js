/**
 * @name deepEqual
 * @description - Performs a deep comparison between two values to determine if they are equivalent
 * @category Helpers
 * @usage low
 *
 * @param {any} a The first value to compare
 * @param {any} b The second value to compare
 * @returns {boolean} `true` if the two values are deeply equal, `false` otherwise
 *
 * @example
 * deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } });
 */
export const deepEqual = (a, b) => {
  const seen = new WeakMap();
  const mark = (x, y) => {
    const visited = seen.get(x);
    if (visited) {
      if (visited.has(y)) return true;
      visited.add(y);
      return false;
    }
    seen.set(x, new WeakSet([y]));
    return false;
  };
  const compare = (x, y) => {
    if (Object.is(x, y)) return true;
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) return false;
    if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;
    if (mark(x, y)) return true;
    if (x instanceof Date) return y instanceof Date && Object.is(x.getTime(), y.getTime());
    if (x instanceof RegExp)
      return y instanceof RegExp && x.source === y.source && x.flags === y.flags;
    if (x instanceof Error)
      return y instanceof Error && x.name === y.name && x.message === y.message;
    if (Array.isArray(x)) {
      if (!Array.isArray(y) || x.length !== y.length) return false;
      for (let index = 0; index < x.length; index += 1) {
        if (!compare(x[index], y[index])) return false;
      }
      return true;
    }
    if (x instanceof Set) {
      if (!(y instanceof Set) || x.size !== y.size) return false;
      for (const value of x) {
        if (!y.has(value)) return false;
      }
      return true;
    }
    if (x instanceof Map) {
      if (!(y instanceof Map) || x.size !== y.size) return false;
      for (const [key, value] of x) {
        if (!y.has(key) || !compare(value, y.get(key))) return false;
      }
      return true;
    }
    const xo = x;
    const yo = y;
    const keysX = [...Object.keys(xo), ...Object.getOwnPropertySymbols(xo)];
    const keysY = [...Object.keys(yo), ...Object.getOwnPropertySymbols(yo)];
    if (keysX.length !== keysY.length) return false;
    if (
      !Object.keys(xo).length &&
      Object.getPrototypeOf(x) !== Object.prototype &&
      Object.getPrototypeOf(x) !== null
    )
      return false;
    for (const key of keysX) {
      if (!Object.hasOwn(yo, key)) return false;
      if (!compare(xo[key], yo[key])) return false;
    }
    return true;
  };
  return compare(a, b);
};
