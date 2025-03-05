import { useEffect } from 'react';
import { getElement, isTarget } from '@/utils/helpers';
import { useRefState } from '../useRefState/useRefState';
/**
 * @name useScrollIntoView
 * @description - Hook that provides functionality to scroll an element into view
 * @category Sensors
 *
 * @overload
 * @param {HookTarget} target The target element to scroll into view
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn} Object containing scroll function
 *
 * @example
 * const { trigger } = useScrollIntoView(ref);
 *
 * @overload
 * @template Target The target element
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn & { ref: StateRef<Target> }} Object containing scroll function and ref
 *
 * @example
 * const { ref, trigger } = useScrollIntoView<HTMLDivElement>();
 */
export const useScrollIntoView = ((...params) => {
    const target = (isTarget(params[0]) ? params[0] : undefined);
    const options = (target ? params[1] : params[0]);
    const internalRef = useRefState();
    const { behavior = 'smooth', block = 'start', inline = 'nearest', enabled = true } = options ?? {};
    useEffect(() => {
        if (!enabled)
            return;
        if (!target && !internalRef.state)
            return;
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        element.scrollIntoView({
            behavior,
            block,
            inline
        });
    }, [target, internalRef.state, enabled]);
    const trigger = (params) => {
        const element = (target ? getElement(target) : internalRef.current);
        if (!element)
            return;
        const { behavior, block, inline } = params ?? {};
        element.scrollIntoView({
            behavior,
            block,
            inline
        });
    };
    if (target)
        return { trigger };
    return { ref: internalRef, trigger };
});
