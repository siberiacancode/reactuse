import { useEffect, useRef, useState } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const resolveAutoIncrement = (progress: number, trickleRate: number) => {
  if (progress < 0.25) return 0.12 + trickleRate * Math.random();
  if (progress < 0.5) return 0.08 + trickleRate * Math.random();
  if (progress < 0.8) return 0.03 + trickleRate * Math.random();
  if (progress < 0.95) return 0.01 + (trickleRate / 2) * Math.random();
  if (progress < 0.99) return 0.005 * Math.random();
  return 0;
};

/** The use progress options type */
export interface UseProgressOptions {
  /** Delay before reset to null after done */
  delay?: number;
  /** Start progress immediately */
  immediately?: boolean;
  /** Maximum progress value */
  maximum?: number;
  /** Additional random amount for each auto increment */
  rate?: number;
  /** Auto-increment frequency in milliseconds */
  speed?: number;
}

/** The use progress return type */
export interface UseProgressReturn {
  /** Whether progress is currently active */
  active: boolean;
  /** Current progress value in range 0..1, null means hidden */
  value: number;
  /** Complete progress to 100% */
  done: (force?: boolean) => number | null;
  /** Increment progress with easing behavior */
  inc: (amount?: number) => number | null;
  /** Remove progress and stop timers */
  remove: () => void;
  /** Start progress and auto incrementing */
  start: (from?: number | null) => number;
}

/**
 * @name useProgress
 * @description - Hook that creates a lightweight progress bar
 * @category Time
 * @usage medium
 *
 * @param {number} [initialProgress] Initial progress value in range 0..1
 * @param {boolean} [options.active] Controls progress externally (true -> start, false -> done)
 * @param {number} [options.maximum=0.95] Maximum value when progress starts
 * @param {number} [options.speed=250] Auto increment interval in milliseconds
 * @param {number} [options.rate=0.02] Additional random increment amount on each tick
 * @param {number} [options.delay=250] Delay before reset to null after done
 * @returns {UseProgressReturn} Current progress state and control methods
 *
 * @example
 * const { value, active, start, done, inc, set, remove } = useProgress(0.2);
 */
export const useProgress = (initialValue: number = 0, options: UseProgressOptions = {}) => {
  const speed = Math.max(options.speed ?? 250, 16);
  const rate = clamp(options.rate ?? 0.02, 0, 0.3);
  const maximum = options.maximum ?? 0.98;
  const delay = options.delay ?? 250;

  const [value, setValue] = useState(initialValue);
  const [active, setActive] = useState(!!options.immediately);
  const [internalActive, setInternalActive] = useState(active);

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const done = () => {
    setValue(1);
    setInternalActive(false);
    setTimeout(() => setActive(false), delay);
  };

  const inc = (amount: number = resolveAutoIncrement(value, rate)) =>
    setValue((currentValue) => clamp(currentValue + amount, initialValue, maximum));

  const start = (from: number = initialValue) => {
    setActive(true);
    setInternalActive(true);
    setValue(from);
  };

  const remove = () => {
    setActive(false);
    setInternalActive(false);
    setValue(0);
  };

  useEffect(() => {
    if (!internalActive) return;
    intervalIdRef.current = setInterval(inc, speed);
    return () => clearInterval(intervalIdRef.current);
  }, [internalActive, speed, rate]);

  return {
    value,
    active,
    start,
    done,
    inc,
    remove
  };
};
