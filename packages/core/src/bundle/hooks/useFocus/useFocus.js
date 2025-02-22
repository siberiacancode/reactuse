import { useEffect, useRef, useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to focus
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @returns {UseFocusReturn} An object with a `focus` boolean state value
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref);
 *
 * @overload
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @returns {UseFocusReturn} An object with a `focus` boolean state value
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus();
 */
export const useFocus = ((...params) => {
    const target = isTarget(params[0]) ? params[0] : undefined;
    const options = (target ? params[1] : params[0]) ?? {};
    const initialValue = options.initialValue ?? false;
    const [focused, setFocused] = useState(initialValue);
    const internalRef = useRefState();
    const elementRef = useRef();
    const focus = () => elementRef.current?.focus();
    const blur = () => elementRef.current?.blur();
    useEffect(() => {
        if (!target && !internalRef.state)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        elementRef.current = element;
        const onFocus = (event) => {
            if (!focus || event.target.matches?.(':focus-visible'))
                setFocused(true);
        };
        const onBlur = () => setFocused(false);
        if (initialValue)
            element.focus();
        element.addEventListener('focus', onFocus);
        element.addEventListener('blur', onBlur);
        return () => {
            element.removeEventListener('focus', onFocus);
            element.removeEventListener('blur', onBlur);
        };
    }, [target, internalRef.state]);
    if (target)
        return { focus, blur, focused };
    return {
        ref: internalRef,
        focus,
        blur,
        focused
    };
});
