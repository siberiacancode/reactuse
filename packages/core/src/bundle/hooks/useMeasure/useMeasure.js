import { useState } from 'react';
import { useRefState } from '../useRefState/useRefState';
import { useResizeObserver } from '../useResizeObserver/useResizeObserver';
/**
 * @name useMeasure
 * @description - Hook to measure the size and position of an element
 * @category Browser
 *
 * @overload
 * @template Target The element to measure
 * @param {Target} [target] The element to measure
 * @returns {UseMeasureReturn} The element's size and position
 *
 * @example
 * const { x, y, width, height, top, left, bottom, right } = useMeasure(ref);
 *
 * @overload
 * @template Target The element to measure
 * @returns {UseMeasureReturn & { ref: RefObject<Target> }} The element's size and position
 *
 * @example
 * const { ref, x, y, width, height, top, left, bottom, right } = useMeasure();
 */
export const useMeasure = ((target) => {
    const internalRef = useRefState();
    const [rect, setRect] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    });
    useResizeObserver((target ?? internalRef.current), {
        onChange: ([entry]) => {
            if (!entry)
                return;
            const { x, y, width, height, top, left, bottom, right } = entry.contentRect;
            setRect({ x, y, width, height, top, left, bottom, right });
        }
    });
    if (target)
        return rect;
    return { ref: internalRef, ...rect };
});
