import { useState } from 'react';
import { flushSync } from 'react-dom';
/**
 * @name useQueue
 * @description - Hook that manages a queue
 * @category Utilities
 *
 * @template Value The type of the value
 * @param {Value[]} [initialValue=[]] The initial value of the queue
 * @returns {UseQueueReturn} An object containing the current queue and functions to interact with the queue
 *
 * @example
 * const { queue, add, remove, clear, first, last, size } = useQueue([1, 2, 3]);
 */
export const useQueue = (initialValue = []) => {
  const [queue, setQueue] = useState(initialValue);
  const add = (element) => setQueue((queue) => [...queue, element]);
  const clear = () => setQueue([]);
  const remove = () => {
    let removed;
    flushSync(() => {
      setQueue(([first, ...rest]) => {
        removed = first;
        return rest;
      });
    });
    return removed;
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
