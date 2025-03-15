import { useState } from 'react';
/**
 * @name useSet
 * @description - Hook that manages a set structure
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {UseSetReturn<Value>} An object containing the current set and functions to interact with the set
 *
 * @example
 * const { value, add, remove, clear, reset, toggle, union, intersection, difference, symmetricDifference, size, has } = useSet([1, 2, 3]);
 */
export const useSet = (values) => {
  const [set, setSet] = useState(new Set(values));
  const add = (value) => setSet((prevSet) => new Set(prevSet).add(value));
  const remove = (value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return prevSet;
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const clear = () => setSet(new Set());
  const reset = () => setSet(new Set(values));
  const toggle = (value) =>
    setSet((prevSet) => {
      if (!prevSet.has(value)) return new Set(prevSet).add(value);
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  const union = (other) => setSet(set.union(other));
  const difference = (other) => setSet(set.difference(other));
  const symmetricDifference = (other) => setSet(set.symmetricDifference(other));
  const intersection = (other) => setSet(set.intersection(other));
  const has = (value) => set.has(value);
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
