import { useEffect, useRef, useState } from 'react';

/* The use raf callback params type */
export interface UseRafCallbackParams {
  /** The delta between each frame in milliseconds */
  delta: number;
  /** The timestamp of the current frame in milliseconds */
  timestamp: DOMHighResTimeStamp;
}

/* The use raf callback type */
export type UseRafCallbackCallback = (params: UseRafCallbackParams) => void;

/* The use raf callback options type */
export interface UseRafCallbackOptions {
  /** The delay between each frame in milliseconds */
  delay?: number;
  /** Whether the callback should be enabled */
  enabled?: boolean;
}

/* The use raf callback return type */
export interface UseRafCallbackReturn {
  /** Whether the callback is active */
  isActive: boolean;
  /** Function to pause the callback */
  pause: () => void;
  /** Function to resume the callback */
  resume: () => void;
}

/**
 * @name useRafCallback
 * @description - Hook that defines the logic for raf callback
 * @category Utilities
 *
 * @param {UseRafCallback} callback The callback to execute
 * @param {number} [options.delay] The delay between each frame in milliseconds
 * @param {boolean} [options.enabled=false] Whether the callback should be enabled
 * @returns {UseRafCallbackReturn} An object of raf callback functions
 *
 * @example
 * useRafCallback(() => console.log('callback'));
 */
export const useRafCallback = (
  callback: UseRafCallbackCallback,
  options?: UseRafCallbackOptions
): UseRafCallbackReturn => {
  const rafIdRef = useRef<number | null>(null);
  const previousFrameTimestampRef = useRef(0);
  const [isActive, setIsActive] = useState(false);
  const enabled = options?.enabled ?? false;

  const loop = (timestamp: DOMHighResTimeStamp) => {
    const delta = timestamp - previousFrameTimestampRef.current;

    if (options?.delay && delta < options?.delay) {
      rafIdRef.current = window.requestAnimationFrame(loop);
      return;
    }

    previousFrameTimestampRef.current = timestamp;
    callback({ delta, timestamp });
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  const resume = () => {
    if (isActive) return;
    setIsActive(true);
    previousFrameTimestampRef.current = 0;
    rafIdRef.current = window.requestAnimationFrame(loop);
  };

  function pause() {
    if (!rafIdRef.current) return;

    setIsActive(false);
    window.cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }

  useEffect(() => {
    if (!enabled) return;
    resume();

    return pause;
  }, [enabled]);

  return {
    isActive,
    pause,
    resume
  };
};
