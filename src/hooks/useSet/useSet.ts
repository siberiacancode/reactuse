import { useState } from 'react';

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

/** The use set return type */
interface UseSetReturn<Value> {
  /** The current set */
  value: Set<Value>;
  /** The size of the set */
  size: number;
  /** Function to check if a value exists in the set */
  has: (value: Value) => boolean;
  /** Function to add a value to the set */
  add: (value: Value) => void;
  /** Function to remove a value from the set */
  remove: (value: Value) => void;
  /** Function to clear the set */
  clear: () => void;
  /** Function to toggle a value in the set */
  reset: () => void;
  /** Function to toggle a value in the set */
  toggle: (value: Value) => void;
  /** Function to get the union of two sets */
  union: (other: Set<Value>) => void;
  /** Function to get the difference of two sets */
  intersection: (other: Set<Value>) => void;
  /** Function to get the symmetric difference of two sets */
  difference: (other: Set<Value>) => void;
  /** Function to get the symmetric difference of two sets */
  symmetricDifference: (other: Set<Value>) => void;
}

/**
 * @name useSet
 * @description - Hook that manages a set structure
 *
 * @template Value The type of the value
 * @param {Value[]} [values] The initial array of the set
 * @returns {UseSetReturn} An object containing the current set and functions to interact with the set
 *
 * @example
 * const { value, add, remove, clear, reset, toggle, union, intersection, difference, symmetricDifference, size, has } = useSet([1, 2, 3]);
 */
export const useSet = <Value>(values?: Value[]): UseSetReturn<Value> => {
  const [set, setSet] = useState(new Set(values));

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
