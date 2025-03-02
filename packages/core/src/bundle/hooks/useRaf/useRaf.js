import { useEffect, useRef, useState } from 'react';
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
export const useRaf = (callback, options) => {
    const rafIdRef = useRef(null);
    const previousFrameTimestampRef = useRef(0);
    const [active, setActive] = useState(false);
    const enabled = options?.enabled ?? true;
    const internalCallbackRef = useRef(callback);
    internalCallbackRef.current = callback;
    const loop = (timestamp) => {
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
        if (active)
            return;
        setActive(true);
        previousFrameTimestampRef.current = 0;
        rafIdRef.current = window.requestAnimationFrame(loop);
    };
    function pause() {
        if (!rafIdRef.current)
            return;
        setActive(false);
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
    }
    useEffect(() => {
        if (!enabled)
            return;
        resume();
        return pause;
    }, [enabled, options?.delay]);
    return {
        active,
        pause,
        resume
    };
};
