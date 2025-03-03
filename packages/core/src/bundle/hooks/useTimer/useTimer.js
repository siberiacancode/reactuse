import { useState } from 'react';
import { useInterval } from '../useInterval/useInterval';
export const getTimeFromSeconds = (timestamp) => {
    const roundedTimestamp = Math.ceil(timestamp);
    const days = Math.floor(roundedTimestamp / (60 * 60 * 24));
    const hours = Math.floor((roundedTimestamp % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((roundedTimestamp % (60 * 60)) / 60);
    const seconds = Math.floor(roundedTimestamp % 60);
    return {
        seconds,
        minutes,
        hours,
        days
    };
};
/**
 * @name useTimer
 * @description - Hook that creates a timer functionality
 * @category Time
 *
 * @overload
 * @param {number} timestamp The timestamp value that define for how long the timer will be running
 * @param {() => void} callback The function to be executed once countdown timer is expired
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, running } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} timestamp The timestamp value that define for how long the timer will be running
 * @param {boolean} options.autostart The flag to decide if timer should start automatically
 * @param {() => void} options.onExpire The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} options.onTick The function to be executed on each tick of the timer
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, running } = useTimer(1000);
 */
export const useTimer = ((...params) => {
    const timestamp = params[0];
    const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] });
    const autostart = options?.autostart ?? true;
    const [seconds, setSeconds] = useState(Math.ceil(timestamp / 1000));
    const [running, setRunning] = useState(autostart);
    const restart = (timestamp, autostart = true) => {
        setSeconds(Math.ceil(timestamp / 1000));
        setRunning(autostart);
    };
    const start = () => {
        setRunning(true);
        setSeconds(Math.ceil(timestamp / 1000));
    };
    useInterval(() => {
        const updatedSeconds = seconds - 1;
        options?.onTick?.(seconds);
        setSeconds(updatedSeconds);
        if (updatedSeconds === 0) {
            setRunning(false);
            options?.onExpire?.();
        }
    }, 1000, { enabled: running });
    return {
        ...getTimeFromSeconds(seconds),
        pause: () => setRunning(false),
        toggle: () => setRunning(!running),
        start,
        restart,
        running
    };
});
