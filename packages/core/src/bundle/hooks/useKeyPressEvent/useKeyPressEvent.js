import { useEffect, useRef } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useKeyPressEvent
 * @description - Hook that listens for key press events on specified targets
 * @category Sensors
 *
 * @overload
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {HookTarget | Window} target The target to attach the event listener to.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseKeyPressEventOptions} [options] The options for the event listener.
 * @returns {void}
 *
 * @example
 * useKeyPressEvent(ref, 'Enter', () => console.log('pressed'));
 *
 * @overload
 * @template Target extends Element
 * @param {UseKeyPressEventKey} key The key or array of keys to listen for.
 * @param {(event: KeyboardEvent) => void} listener The callback function to be executed when the specified key or keys are pressed.
 * @param {UseKeyPressEventOptions} [options] The options for the event listener.
 * @returns {{ ref: StateRef<Target> }} An object containing the ref
 *
 * @example
 * const ref = useKeyPressEvent('Enter', (event) => console.log('pressed'));
 */
export const useKeyPressEvent = ((...params) => {
    const target = isTarget(params[0]) ? params[0] : undefined;
    const key = (target ? params[1] : params[0]);
    const listener = (target ? params[2] : params[1]);
    const options = (target ? params[3] : params[2]);
    const internalRef = useRefState(window);
    const keyRef = useRef(key);
    keyRef.current = key;
    const listenerRef = useRef(listener);
    listenerRef.current = listener;
    useEffect(() => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const onKeyDown = (event) => {
            const keyboardEvent = event;
            const keys = Array.isArray(keyRef.current) ? keyRef.current : [keyRef.current];
            if (keys.includes(keyboardEvent.key)) {
                listenerRef.current(keyboardEvent);
            }
        };
        element.addEventListener('keydown', onKeyDown, {
            capture: options?.capture,
            passive: options?.passive,
            once: options?.once
        });
        return () => {
            element.removeEventListener('keydown', onKeyDown, {
                capture: options?.capture
            });
        };
    }, [target, internalRef.state, options?.capture, options?.passive, options?.once]);
    if (target)
        return;
    return internalRef;
});
