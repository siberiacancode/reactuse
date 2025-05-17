import { useEffect, useRef, useState } from 'react';

/* The use raf params type */
export interface UseRafParams {
  /** The delta between each frame in milliseconds */
  delta: number;
  /** The timestamp of the current frame in milliseconds */
  timestamp: DOMHighResTimeStamp;
}

/* The use raf type */
export type UseRafCallback = (params: UseRafParams) => void;

/* The use raf options type */
export interface UseRafOptions {
  /** The delay between each frame in milliseconds */
  delay?: number;
  /** Whether the callback should be enabled */
  enabled?: boolean;
}

/* The use raf return type */
export interface UseRafReturn {
  /** Whether the callback is active */
  active: boolean;
  /** Function to pause the callback */
  pause: () => void;
  /** Function to resume the callback */
  resume: () => void;
}

/**
 * @name useRaf
 * @description - Hook that defines the logic for raf callback
 * @category Utilities
 *
 * @browserapi requestAnimationFrame https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 *
 * @param {UseRafCallback} callback The callback to execute
 * @param {number} [options.delay] The delay between each frame in milliseconds
 * @param {boolean} [options.enabled=true] Whether the callback should be enabled
 * @returns {UseRafCallbackReturn} An object of raf callback functions
 *
 * @example
 * useRaf(() => console.log('callback'));
 */
export const useRaf = (callback: UseRafCallback, options?: UseRafOptions): UseRafReturn => {
  const rafIdRef = useRef<number | null>(null);
  const previousFrameTimestampRef = useRef(0);
  const [active, setActive] = useState(false);
  const enabled = options?.enabled ?? true;

  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  const loop = (timestamp: DOMHighResTimeStamp) => {
    const delta = timestamp - previousFrameTimestampRef.current;

    if (options?.delay && delta < options?.delay) {
      rafIdRef.current = window.requestAnimationFrame(loop);
      return;
    }

    previousFrameTimestampRef.current = timestamp;
    internalCallbackRef.current({ delta, timestamp });
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  const resume = () => {
    if (active) return;
    setActive(true);
    previousFrameTimestampRef.current = 0;
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  function pause() {
    if (!rafIdRef.current) return;

    setActive(false);
    window.cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }

  useEffect(() => {
    if (!enabled) return;
    resume();

    return pause;
  }, [enabled, options?.delay]);

  return {
    active,
    pause,
    resume
  };
};
