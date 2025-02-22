import { useRef, useState } from 'react';
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
export const useStateHistory = (initialValue, maxSize) => {
    const [value, setValue] = useState(initialValue);
    const [history, setHistory] = useState([initialValue]);
    const currentIndexRef = useRef(0);
    const set = (value) => {
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, currentIndexRef.current + 1);
            newHistory.push(value);
            if (maxSize && newHistory.length > maxSize)
                newHistory.shift();
            currentIndexRef.current = newHistory.length - 1;
            return newHistory;
        });
        setValue(value);
    };
    const undo = () => {
        if (currentIndexRef.current === 0)
            return;
        currentIndexRef.current--;
        setValue(history[currentIndexRef.current]);
        setHistory((prevHistory) => prevHistory.slice(0, currentIndexRef.current + 1));
    };
    const back = (steps = 1) => {
        if (currentIndexRef.current - steps < 0)
            return;
        currentIndexRef.current -= steps;
        setValue(history[currentIndexRef.current]);
    };
    const forward = (steps = 1) => {
        if (currentIndexRef.current + steps >= history.length)
            return;
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
