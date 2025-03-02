import { useEffect, useRef, useState } from 'react';
import { getElement } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 *  @name useResizeObserver
 *  @description - Hook that gives you resize observer state
 *  @category Browser
 *
 *  @browserapi ResizeObserver https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 *
 *  @overload
 *  @template Target The target element
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn & { ref: (node: Target) => void }} An object containing the resize observer state
 *
 *  @example
 *  const { ref, entries } = useResizeObserver();
 *
 *  @overload
 *  @template Target The target element
 *  @param {Target} target The target element to observe
 *  @param {boolean} [options.enabled=true] The IntersectionObserver options
 *  @param {boolean} [options.box] The IntersectionObserver options
 *  @param {(entries: ResizeObserverEntry[], observer: ResizeObserver) => void} [options.onChange] The callback to execute when resize is detected
 *  @returns {UseResizeObserverReturn} An object containing the resize observer state
 *
 *  @example
 *  const { entries } = useResizeObserver(ref);
 */
export const useResizeObserver = ((...params) => {
    const target = (typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]);
    const options = (target ? params[1] : params[0]);
    const enabled = options?.enabled ?? true;
    const [entries, setEntries] = useState([]);
    const internalRef = useRefState();
    const internalOnChangeRef = useRef();
    internalOnChangeRef.current = options?.onChange;
    useEffect(() => {
        if (!enabled && !target && !internalRef.state)
            return;
        const element = target ? getElement(target) : internalRef.current;
        if (!element)
            return;
        const observer = new ResizeObserver((entries) => {
            setEntries(entries);
            internalOnChangeRef.current?.(entries, observer);
        });
        observer.observe(element, options);
        return () => {
            observer.disconnect();
        };
    }, [target, internalRef.state, options?.box, enabled]);
    if (target)
        return { entries };
    return {
        ref: internalRef,
        entries
    };
});
