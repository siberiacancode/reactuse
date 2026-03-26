import { useEffect, useRef } from 'react';
import { isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
import { useRerender } from '../useRerender/useRerender';
/**
 * @name useMouse
 * @description - Hook that manages a mouse position
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to manage the mouse position for
 * @param {(value: UseMouseValue, event: Event) => void} [callback] The callback to invoke on mouse updates
 * @returns {UseMouseReturn} An object with mouse value controls
 *
 * @example
 * const mouse = useMouse(ref);
 *
 * @overload
 * @template Target The target element
 * @param {(value: UseMouseValue, event: Event) => void} [callback] The callback to invoke on mouse updates
 * @returns {UseMouseReturn & { ref: StateRef<Target> }} An object with mouse value controls and a ref
 *
 * @example
 * const mouse = useMouse<HTMLDivElement>();
 */
export const useMouse = ((...params) => {
    const target = isTarget(params[0]) ? params[0] : undefined;
    const callback = (target ? params[1] : params[0]);
    const snapshotRef = useRef({
        x: 0,
        y: 0,
        elementX: 0,
        elementY: 0,
        elementPositionX: 0,
        elementPositionY: 0,
        clientX: 0,
        clientY: 0
    });
    const internalCallbackRef = useRef(callback);
    internalCallbackRef.current = callback;
    const watchingRef = useRef(false);
    const rerender = useRerender();
    const internalRef = useRefState();
    const updateValue = (nextValue, event) => {
        snapshotRef.current = nextValue;
        internalCallbackRef.current?.(nextValue, event);
        if (watchingRef.current)
            rerender();
    };
    const watch = () => {
        watchingRef.current = true;
        return snapshotRef.current;
    };
    useEffect(() => {
        const onMouseMove = (event) => {
            const element = (target ? isTarget.getElement(target) : internalRef.current);
            const updatedValue = {
                x: event.pageX,
                y: event.pageY,
                clientX: event.clientX,
                clientY: event.clientY,
                elementX: event.pageX,
                elementY: event.pageY,
                elementPositionX: 0,
                elementPositionY: 0
            };
            if (element) {
                const { left, top } = element.getBoundingClientRect();
                const elementPositionX = left + window.scrollX;
                const elementPositionY = top + window.scrollY;
                const elementX = event.pageX - elementPositionX;
                const elementY = event.pageY - elementPositionY;
                updatedValue.elementX = elementX;
                updatedValue.elementY = elementY;
                updatedValue.elementPositionX = elementPositionX;
                updatedValue.elementPositionY = elementPositionY;
            }
            updateValue(updatedValue, event);
        };
        const onScroll = (event) => {
            const updatedValue = {
                ...snapshotRef.current,
                x: snapshotRef.current.x + window.scrollX - snapshotRef.current.elementPositionX,
                y: snapshotRef.current.y + window.scrollY - snapshotRef.current.elementPositionY,
                elementPositionX: window.scrollX,
                elementPositionY: window.scrollY
            };
            updateValue(updatedValue, event);
        };
        document.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('scroll', onScroll);
            document.removeEventListener('mousemove', onMouseMove);
        };
    }, [internalRef.state, target && isTarget.getRawElement(target)]);
    if (target)
        return { snapshot: snapshotRef.current, watch };
    return {
        ref: internalRef,
        snapshot: snapshotRef.current,
        watch
    };
});
