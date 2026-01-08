import { useMemo, useRef } from 'react';

export type BatchedCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  flush: () => void;
  cancel: () => void;
};

/**
 * @name useBatchedCallback
 * @description - Hook that batches calls and forwards them to a callback
 * @category Utilities
 * @usage medium
 *
 * @template Params The type of the params
 * @param {(batch: Params[]) => void} callback The callback that receives a batch of calls
 * @param {number} batchSize The maximum size of a batch before it is flushed
 * @returns {BatchedCallback<Params>} The batched callback with flush and cancel helpers
 *
 * @example
 * const batched = useBatchedCallback((batch) => console.log(batch), 5);
 */
export const useBatchedCallback = <Params extends unknown[]>(
  callback: (batch: Params[]) => void,
  size: number
): BatchedCallback<Params> => {
  const callbackRef = useRef(callback);
  const sizeRef = useRef(size);
  const queueRef = useRef<Params[]>([]);

  callbackRef.current = callback;
  sizeRef.current = size;

  const flush = () => {
    if (!queueRef.current.length) return;
    const batch = queueRef.current;
    queueRef.current = [];
    callbackRef.current(batch);
  };

  const batched = useMemo(() => {
    const batchedCallback = (...args: Params) => {
      queueRef.current.push(args);
      if (queueRef.current.length >= sizeRef.current) flush();
    };

    batchedCallback.flush = flush;
    batchedCallback.cancel = () => (queueRef.current = []);

    return batchedCallback as BatchedCallback<Params>;
  }, []);

  return batched;
};
