const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null;

const isPlainObject = (value: object) => {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/**
 * @name shallowEqual
 * @description - Performs a shallow comparison between two values to determine if they are equivalent
 * @category Helpers
 * @usage low
 *
 * @param {any} a The first value to compare
 * @param {any} b The second value to compare
 * @returns {boolean} `true` if the two values are shallowly equal, `false` otherwise
 *
 * @warning - Set members and Map keys are compared by reference. Objects without own enumerable string keys are compared by reference unless they are plain objects.
 *
 * @example
 * shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 */
export const shallowEqual = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (!isObject(a) || !isObject(b)) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (a instanceof Date) return b instanceof Date && Object.is(a.getTime(), b.getTime());
  if (a instanceof RegExp)
    return b instanceof RegExp && a.source === b.source && a.flags === b.flags;
  if (a instanceof Error) return b instanceof Error && a.name === b.name && a.message === b.message;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;

    for (let index = 0; index < a.length; index += 1) {
      if (!Object.is(a[index], b[index])) return false;
    }

    return true;
  }

  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;

    for (const value of a) {
      if (!b.has(value)) return false;
    }

    return true;
  }

  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;

    for (const [key, value] of a) {
      if (!b.has(key) || !Object.is(value, b.get(key))) return false;
    }

    return true;
  }

  const ao = a as Record<PropertyKey, unknown>;
  const bo = b as Record<PropertyKey, unknown>;

  const keysA = [...Object.keys(ao), ...Object.getOwnPropertySymbols(ao)];
  const keysB = [...Object.keys(bo), ...Object.getOwnPropertySymbols(bo)];

  if (keysA.length !== keysB.length) return false;
  if (!Object.keys(ao).length && !isPlainObject(a)) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(bo, key)) return false;
    if (!Object.is(ao[key], bo[key])) return false;
  }

  return true;
};
