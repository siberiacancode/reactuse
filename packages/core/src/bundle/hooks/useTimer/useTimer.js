import { useEffect, useRef, useState } from 'react';
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
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {() => void} callback The function to be executed once countdown timer is expired
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active } = useTimer(1000, () => console.log('ready'));
 *
 * @overload
 * @param {number} seconds The seconds value that define for how long the timer will be running
 * @param {boolean} [options.immediately=true] The flag to decide if timer should start automatically
 * @param {() => void} [options.onExpire] The function to be executed when the timer is expired
 * @param {(timestamp: number) => void} [options.onTick] The function to be executed on each tick of the timer
 * @returns {UseTimerReturn} An object containing the timer properties and functions
 *
 * @example
 * const { days, hours, minutes, seconds, toggle, pause, start, restart, resume, active } = useTimer(1000);
 */
export const useTimer = ((...params) => {
    const initialSeconds = params[0];
    const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] });
    const immediately = options?.immediately ?? true;
    const [active, setActive] = useState(immediately ?? true);
    const [seconds, setSeconds] = useState(initialSeconds);
    const intervalIdRef = useRef();
    const optionsRef = useRef();
    optionsRef.current = options ?? {};
    useEffect(() => {
        if (!active)
            return;
        const onInterval = () => {
            optionsRef.current?.onTick?.(seconds);
            setSeconds((prevSeconds) => {
                const updatedSeconds = prevSeconds - 1;
                if (updatedSeconds === 0) {
                    setActive(false);
                    optionsRef.current?.onExpire?.();
                }
                return updatedSeconds;
            });
        };
        intervalIdRef.current = setInterval(onInterval, 1000);
        return () => {
            clearInterval(intervalIdRef.current);
        };
    }, [active]);
    const pause = () => setActive(false);
    const resume = () => {
        if (seconds <= 0)
            return;
        setActive(true);
    };
    const toggle = () => setActive(!active);
    const restart = (seconds, immediately = true) => {
        setSeconds(seconds);
        if (immediately)
            setActive(true);
    };
    const start = () => {
        setActive(true);
        setSeconds(initialSeconds);
    };
    const clear = () => {
        setActive(false);
        setSeconds(0);
    };
    const update = (seconds) => setSeconds(seconds);
    const increase = (seconds) => setSeconds((prevSeconds) => prevSeconds + seconds);
    const decrease = (seconds) => {
        setSeconds((prevSeconds) => {
            const updatedSeconds = prevSeconds - seconds;
            if (updatedSeconds <= 0) {
                setActive(false);
                return 0;
            }
            else {
                return updatedSeconds;
            }
        });
    };
    return {
        ...getTimeFromSeconds(seconds),
        pause,
        active,
        resume,
        toggle,
        start,
        restart,
        clear,
        update,
        increase,
        decrease
    };
});
