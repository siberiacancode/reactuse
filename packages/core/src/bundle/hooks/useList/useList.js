import { useState } from 'react';
/**
 * @name useList
 * @description - Hook that provides state and helper methods to manage a list of items
 * @category Utilities
 *
 * @template Item The type of the item
 * @param {Item[] | (() => Item[])} initialList The initial list of items
 * @returns {UseListReturn} An object containing the current list and functions to interact with the list
 *
 * @example
 * const { value, set, push, removeAt, insertAt, updateAt, clear } = useList();
 */
export const useList = (initialList = []) => {
  const [list, setList] = useState(initialList);
  const push = (item) => setList((prevList) => [...prevList, item]);
  const removeAt = (removeAtIndex) =>
    setList((prevList) => [
      ...prevList.slice(0, removeAtIndex),
      ...prevList.slice(removeAtIndex + 1)
    ]);
  const insertAt = (insertAtIndex, item) =>
    setList((l) => [...l.slice(0, insertAtIndex), item, ...l.slice(insertAtIndex)]);
  const updateAt = (updateAtIndex, item) =>
    setList((prevList) =>
      prevList.map((element, index) => (index === updateAtIndex ? item : element))
    );
  const clear = () => setList([]);
  const reset = () => setList(initialList);
  return { value: list, set: setList, push, removeAt, insertAt, updateAt, clear, reset };
};
