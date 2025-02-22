import { useEffect, useState } from 'react';
import { getElement } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useCssVar
 * @description - Hook that returns the value of a CSS variable
 * @category Utilities
 *
 * @overload
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn} The object containing the value of the CSS variable
 *
 * @example
 * const { ref, value, set } = useCssVar('color', 'red');
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element
 * @param {string} key The CSS variable key
 * @param {string} initialValue The initial value of the CSS variable
 * @returns {UseCssVarReturn} The object containing the value of the CSS variable
 *
 * @example
 * const { value, set } = useCssVar(ref, 'color', 'red');
 */
export const useCssVar = ((...params) => {
    const target = (typeof params[0] === 'object' ? params[0] : undefined);
    const key = (target ? params[1] : params[0]);
    const initialValue = (target ? params[2] : params[1]);
    const [value, setValue] = useState(initialValue ?? '');
    const internalRef = useRefState(window.document.documentElement);
    const set = (value) => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        if (element.style) {
            if (!value) {
                element.style.removeProperty(key);
                setValue(value);
                return;
            }
            element.style.setProperty(key, value);
            setValue(value);
        }
    };
    useEffect(() => {
        if (initialValue)
            set(initialValue);
    }, []);
    useEffect(() => {
        if (!target && !internalRef.state)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const onChange = () => {
            const value = window
                .getComputedStyle(element)
                .getPropertyValue(key)
                ?.trim();
            setValue(value ?? initialValue);
        };
        const observer = new MutationObserver(onChange);
        observer.observe(element, { attributeFilter: ['style', 'class'] });
        return () => {
            observer.disconnect();
        };
    }, [target, internalRef.state]);
    return {
        value,
        set
    };
});
