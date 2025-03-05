import { useEffect, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * Hook that tracks which keyboard keys are currently pressed
 *
 * @name useKeysPressed
 * @description Tracks all currently pressed keyboard keys and their codes
 * @category Sensors
 *
 * @overload
 * @param {HookTarget | Window} target DOM element or ref to attach keyboard listeners to
 * @param {UseKeysPressedOptions} [options.enabled=true] Enable or disable the event listeners
 * @returns {Array<{ key: string; code: string }>} Array of currently pressed keys with their key and code values
 *
 * @example
 * const pressedKeys = useKeysPressed(ref);
 *
 * @overload
 * @template Target - Type of the target DOM element
 * @param {UseKeysPressedOptions} [options] - Optional configuration options
 * @returns {{ keys: Array<{ key: string; code: string }>; ref: StateRef<Target> }} Object containing pressed keys array and ref to attach to a DOM element
 *
 * @example
 * const { value, ref } = useKeysPressed();
 */
export const useKeysPressed = ((...params) => {
    const target = (isTarget(params[0]) ? params[0] : undefined);
    const options = (target ? params[1] : params[0]);
    const enabled = options?.enabled ?? true;
    const [value, setValue] = useState([]);
    const internalRef = useRefState(window);
    useEffect(() => {
        if (!enabled)
            return;
        setValue([]);
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const onKeyDown = (event) => {
            const keyboardEvent = event;
            setValue((prevValue) => {
                if (prevValue.some(({ code }) => code === keyboardEvent.code))
                    return prevValue;
                return [...prevValue, { key: keyboardEvent.key, code: keyboardEvent.code }];
            });
        };
        const onKeyUp = (event) => {
            const keyboardEvent = event;
            setValue((prevValue) => prevValue.filter(({ code }) => code !== keyboardEvent.code));
        };
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [enabled, internalRef.state, target]);
    if (target)
        return value;
    return { value, ref: internalRef };
});
