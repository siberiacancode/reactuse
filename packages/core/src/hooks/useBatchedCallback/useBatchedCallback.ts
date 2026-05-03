import { useEffect, useMemo, useRef } from 'react';

export type BatchedCallback<Params extends unknown[]> = ((...args: Params) => void) & {
  flush: () => void;
  cancel: () => void;
};

export interface UseBatchedCallbackOptions {
  delay?: number;
  size: number;
}

/**
 * @name useBatchedCallback
 * @description - Hook that batches calls and forwards them to a callback
 * @category Utilities
 * @usage medium
 *
 * @template Params The type of the params
 * @param {(batch: Params[]) => void} callback The callback that receives a batch of calls
 * @param {number} options.size The batch settings with size and optional delay
 * @param {number} [options.delay=1000] The delay (ms) after which pending calls are flushed
 * @returns {BatchedCallback<Params>} The batched callback with flush and cancel helpers
 *
 * @example
 * const delayed = useBatchedCallback((batch) => console.log(batch), { size: 5, delay: 1000 });
 */
export function useBatchedCallback<Params extends unknown[]>(
  callback: (batch: Params[]) => void,
  options: UseBatchedCallbackOptions
): BatchedCallback<Params> {
  const { size, delay } = options;

  const internalCallbackRef = useRef(callback);
  const sizeRef = useRef(size);
  const delayRef = useRef(delay ?? 0);
  const queueRef = useRef<Params[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  internalCallbackRef.current = callback;
  sizeRef.current = Math.max(1, size);
  delayRef.current = Math.max(0, delay ?? 0);

  const clearTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const flush = () => {
    if (!queueRef.current.length) return;
    clearTimer();
    const batch = queueRef.current;
    queueRef.current = [];
    internalCallbackRef.current(batch);
  };

  const batched = useMemo(() => {
    const batchedCallback = (...args: Params) => {
      queueRef.current.push(args);
      if (queueRef.current.length >= sizeRef.current) {
        flush();
        return;
      }

      if (!delayRef.current || timerRef.current) return;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        flush();
      }, delayRef.current);
    };

    batchedCallback.flush = flush;
    batchedCallback.cancel = () => {
      clearTimer();
      queueRef.current = [];
    };

    return batchedCallback as BatchedCallback<Params>;
  }, []);

  useEffect(
    () => () => {
      clearTimer();
    },
    []
  );

  return batched;
}
