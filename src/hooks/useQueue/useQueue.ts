import React from 'react';

/** The use queue return type */
export interface UseQueueReturn<Value> {
  /** The current queue */
  queue: Value[];
  /** Add an element to the queue */
  add: (element: Value) => void;
  /** Remove an element from the queue */
  remove: () => Value;
  /** Clear the queue */
  clear: () => void;
  /** Get the first element of the queue */
  first: Value;
  /** Get the last element of the queue */
  last: Value;
  /** Get the size of the queue */
  size: number;
}

/**
 * @name useQueue
 * @description - Hook that manages a queue
 *
 * @template Value The type of the value
 * @param {Value[]} [initialValue=[]] The initial value of the queue
 * @returns {UseQueueReturn} An object containing the current queue and functions to interact with the queue
 *
 * @example
 * const { queue, add, remove, clear, first, last, size } = useQueue([1, 2, 3]);
 */
export const useQueue = <Value>(initialValue: Value[] = []): UseQueueReturn<Value> => {
  const [queue, setQueue] = React.useState(initialValue);

  const add = (element: Value) => setQueue((queue) => [...queue, element]);
  const clear = () => setQueue([]);
  const remove = () => {
    let removed;
    setQueue(([first, ...rest]) => {
      removed = first;
      return rest;
    });
    return removed as Value;
  };

  return {
    add,
    remove,
    clear,
    first: queue[0],
    last: queue[queue.length - 1],
    size: queue.length,
    queue
  };
};
