import { useState } from 'react';

/** The use list return type */
export interface UseListReturn<Item> {
  /** The current list of items */
  value: Item[];
  /** Clears the list */
  clear: () => void;
  /** Inserts an item at the specified index */
  insertAt: (insertAtIndex: number, item: Item) => void;
  /** Adds an item to the list */
  push: (item: Item) => void;
  /** Removes an item from the list */
  removeAt: (removeAtIndex: number) => void;
  /** Sets the list of items */
  set: (list: Item[]) => void;
  /** Updates an item at the specified index */
  updateAt: (updateAtIndex: number, item: Item) => void;
}

/**
 * @name useList
 * @description - Hook that provides state and helper methods to manage a list of items
 * @category State
 *
 * @template Item The type of the item
 * @param {Item[] | (() => Item[])} initialList The initial list of items
 * @returns {UseListReturn} An object containing the current list and functions to interact with the list
 *
 * @example
 * const { value, set, push, removeAt, insertAt, updateAt, clear } = useList();
 */
export const useList = <Item>(initialList: Item[] = []) => {
  const [list, setList] = useState(initialList);

  const push = (item: Item) => setList((prevList) => [...prevList, item]);

  const removeAt = (removeAtIndex: number) =>
    setList((prevList) => [
      ...prevList.slice(0, removeAtIndex),
      ...prevList.slice(removeAtIndex + 1)
    ]);

  const insertAt = (insertAtIndex: number, item: Item) =>
    setList((l) => [...l.slice(0, insertAtIndex), item, ...l.slice(insertAtIndex)]);

  const updateAt = (updateAtIndex: number, item: Item) =>
    setList((prevList) =>
      prevList.map((element, index) => (index === updateAtIndex ? item : element))
    );

  const clear = () => setList([]);

  const reset = () => setList(initialList);

  return {
    value: list,
    set: setList,
    push,
    removeAt,
    insertAt,
    updateAt,
    clear,
    reset
  };
};
