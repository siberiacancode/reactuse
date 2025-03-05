import { useState } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useTextDirection
 * @description - Hook that can get and set the direction of the element
 * @category Browser
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element
 * @returns {UseTextDirectionReturn} An object containing the current text direction of the element
 *
 * @example
 * const { value, set, remove } = useTextDirection(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {UseTextDirectionValue} [initialValue = 'ltr'] The initial direction of the element
 * @returns { { ref: StateRef<Target> } & UseTextDirectionReturn } An object containing the current text direction of the element
 *
 * @example
 * const { ref, value, set, remove } = useTextDirection();
 */
export const useTextDirection = ((...params) => {
    const target = (isTarget(params[0]) ? params[0] : undefined);
    const initialValue = (target ? params[1] : params[0]) ?? 'ltr';
    const internalRef = useRefState();
    const getDirection = () => {
        const element = (target ? getElement(target) : internalRef.current);
        return element?.getAttribute('dir') ?? initialValue;
    };
    const [value, setValue] = useState(getDirection());
    const remove = () => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        element?.removeAttribute('dir');
    };
    const set = (value) => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        setValue(value);
        element.setAttribute('dir', value);
    };
    useIsomorphicLayoutEffect(() => {
        if (!target && !internalRef.state)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const direction = getDirection();
        element.setAttribute('dir', direction);
        setValue(direction);
        const observer = new MutationObserver(getDirection);
        observer.observe(element, { attributes: true });
        return () => {
            observer.disconnect();
        };
    }, [internalRef.state, target]);
    if (target)
        return { value, set, remove };
    return {
        ref: internalRef,
        value,
        set,
        remove
    };
});
