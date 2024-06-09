import React from 'react';

declare global {
  interface Set<T> {
    union(other: Set<T>): Set<T>;
    difference(other: Set<T>): Set<T>;
    symmetricDifference(other: Set<T>): Set<T>;
    intersection(other: Set<T>): Set<T>;
    isDisjointFrom(other: Set<T>): boolean;
    isSubsetOf(other: Set<T>): boolean;
    isSupersetOf(other: Set<T>): boolean;
  }
}

/**
 * @name useSet
 * @description - Hook that manages a set structure
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {Set<Value>} A set structure
 *
 * @example
 * const set = useSet([1, 2, 3]);
 */
export const useSet = <Value>(values?: Value[]) => {
  const [set, setSet] = React.useState(new Set(values));

  const add = (value: Value) => setSet((prevSet) => new Set(prevSet).add(value));
  const remove = (value: Value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return prevSet;
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const clear = () => setSet(new Set());
  const reset = () => setSet(new Set(values));
  const toggle = (value: Value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return new Set(prevSet).add(value);
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const union = (other: Set<Value>) => setSet(set.union(other));
  const difference = (other: Set<Value>) => setSet(set.difference(other));
  const symmetricDifference = (other: Set<Value>) => setSet(set.symmetricDifference(other));
  const intersection = (other: Set<Value>) => setSet(set.intersection(other));
  const has = (value: Value) => set.has(value);

  return {
    value: set,
    size: set.size,
    has,
    add,
    remove,
    clear,
    reset,
    toggle,
    union,
    difference,
    symmetricDifference,
    intersection
  };
};
