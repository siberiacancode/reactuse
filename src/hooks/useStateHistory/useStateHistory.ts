import { useRef, useState } from 'react';

/** The use state history hook return type */
interface UseStateHistoryReturn<Value> {
  /** All history values */
  history: Value[];
  /** Current index in history */
  index: number;
  /** Current value */
  value: Value;
  /** Go back specified number of steps in history (default: 1) */
  back: (steps?: number) => void;
  /** Go forward specified number of steps in history (default: 1) */
  forward: (steps?: number) => void;
  /** Reset history to initial state */
  reset: () => void;
  /** Set a new value */
  set: (value: Value) => void;
  /** Undo the last change */
  undo: () => void;
}

/**
 * @name useStateHistory
 * @description - Hook that manages state with history functionality
 * @category Utilities
 *
 * @param {Value} initialValue - The initial value to start the history with
 * @param {number} [maxSize=10] - Maximum number of history entries to keep
 * @returns {UseStateHistoryReturn<Value>} Object containing current value, history array and control methods
 *
 * @example
 * const { value, history, index, set, back, forward, reset, undo } = useStateHistory(0);
 */
export const useStateHistory = <Value>(
  initialValue: Value,
  maxSize?: number
): UseStateHistoryReturn<Value> => {
  const [value, setValue] = useState<Value>(initialValue);
  const [history, setHistory] = useState<Value[]>([initialValue]);
  const currentIndexRef = useRef<number>(0);

  const set = (value: Value) => {
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, currentIndexRef.current + 1);
      newHistory.push(value);
      if (maxSize && newHistory.length > maxSize) newHistory.shift();
      currentIndexRef.current = newHistory.length - 1;
      return newHistory;
    });
    setValue(value);
  };

  const undo = () => {
    if (currentIndexRef.current === 0) return;
    currentIndexRef.current--;
    setValue(history[currentIndexRef.current]);
    setHistory((prevHistory) => prevHistory.slice(0, currentIndexRef.current + 1));
  };

  const back = (steps: number = 1) => {
    if (currentIndexRef.current - steps < 0) return;
    currentIndexRef.current -= steps;
    setValue(history[currentIndexRef.current]);
  };

  const forward = (steps: number = 1) => {
    if (currentIndexRef.current + steps >= history.length) return;
    currentIndexRef.current += steps;
    setValue(history[currentIndexRef.current]);
  };

  const reset = () => {
    setValue(initialValue);
    setHistory([initialValue]);
    currentIndexRef.current = 0;
  };

  return {
    history,
    value,
    set,
    index: currentIndexRef.current,
    back,
    forward,
    reset,
    undo
  };
};
