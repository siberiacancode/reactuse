import { useEffect } from 'react';
import { useRerender } from '../useRerender/useRerender';
const match = (query) => window.matchMedia(query).matches;
/**
 * @name useBreakpoints
 * @description - Hook that manages breakpoints
 * @category Browser
 *
 * @template {string} Breakpoint The name of the breakpoint
 * @param {Breakpoints<Breakpoint>} breakpoints The breakpoints to use
 * @param {UseBreakpointsStrategy} [strategy=min-width] The strategy to use for matching
 * @returns {UseBreakpointsReturn<Breakpoint>} An object containing the current breakpoint
 *
 * @example
 * const { greaterOrEqual, smallerOrEqual, current } = useBreakpoints({ mobile: 0, tablet: 640, laptop: 1024, desktop: 1280 });
 */
export const useBreakpoints = (breakpoints, strategy = 'mobile-first') => {
    const rerender = useRerender();
    const getValue = (breakpoint, delta) => {
        if (delta)
            return `${Number(breakpoints[breakpoint]) + delta}px`;
        return `${breakpoints[breakpoint]}px`;
    };
    useEffect(() => {
        const onResize = () => rerender();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    const greaterOrEqual = (breakpoint) => match(`(min-width: ${getValue(breakpoint)})`);
    const smallerOrEqual = (breakpoint) => match(`(max-width: ${getValue(breakpoint)})`);
    const current = () => Object.keys(breakpoints)
        .map((breakpoint) => [breakpoint, greaterOrEqual(breakpoint)])
        .filter(([, value]) => value)
        .map(([breakpoint]) => breakpoint);
    const active = () => {
        const breakpoints = current();
        return (breakpoints.length ? breakpoints.at(-1) : undefined);
    };
    const greater = (breakpoint) => match(`(min-width: ${getValue(breakpoint, 0.1)})`);
    const smaller = (breakpoint) => match(`(max-width: ${getValue(breakpoint, -0.1)})`);
    const between = (a, b) => match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`);
    const breakpointsKeys = Object.keys(breakpoints).reduce((acc, breakpoint) => {
        const value = strategy === 'mobile-first' ? greaterOrEqual(breakpoint) : smallerOrEqual(breakpoint);
        acc[breakpoint] = value;
        return acc;
    }, {});
    return {
        current,
        greaterOrEqual,
        smallerOrEqual,
        active,
        greater,
        smaller,
        between,
        isGreater: greater,
        isGreaterOrEqual: greaterOrEqual,
        isSmaller: smaller,
        isSmallerOrEqual: smallerOrEqual,
        isInBetween: between,
        ...breakpointsKeys
    };
};
export * from './constants/breakpoints';
