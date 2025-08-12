import { useEffect } from 'react';
import { useRerender } from '../useRerender/useRerender';
const match = (query) => window.matchMedia(query).matches;
/**
 * @name useBreakpoints
 * @description - Hook that manages breakpoints
 * @category Browser
 * @usage medium
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
    if (delta) return `${Number(breakpoints[breakpoint]) + delta}px`;
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
  const current = () =>
    Object.keys(breakpoints)
      .map((breakpoint) => [breakpoint, greaterOrEqual(breakpoint)])
      .filter(([, value]) => value)
      .map(([breakpoint]) => breakpoint);
  const active = () => {
    const breakpoints = current();
    return breakpoints.length ? breakpoints.at(-1) : undefined;
  };
  const greater = (breakpoint) => match(`(min-width: ${getValue(breakpoint, 0.1)})`);
  const smaller = (breakpoint) => match(`(max-width: ${getValue(breakpoint, -0.1)})`);
  const between = (a, b) =>
    match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`);
  const breakpointsKeys = Object.keys(breakpoints).reduce((acc, breakpoint) => {
    const value =
      strategy === 'mobile-first' ? greaterOrEqual(breakpoint) : smallerOrEqual(breakpoint);
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
/** Breakpoints from Material UI */
export const BREAKPOINTS_MATERIAL_UI = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536
};
/** Breakpoints from Mantine */
export const BREAKPOINTS_MANTINE = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1408
};
/** Breakpoints from Tailwind */
export const BREAKPOINTS_TAILWIND = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};
/**  Breakpoints from Bootstrap V5 */
export const BREAKPOINTS_BOOTSTRAP_V5 = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};
/** Breakpoints from Ant Design */
export const BREAKPOINTS_ANT_DESIGN = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};
/** Breakpoints from Quasar V2 */
export const BREAKPOINTS_QUASAR_V2 = {
  xs: 0,
  sm: 600,
  md: 1024,
  lg: 1440,
  xl: 1920
};
/** Sematic Breakpoints */
export const BREAKPOINTS_SEMANTIC = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop4K: 2560
};
/**  Breakpoints from Master CSS  */
export const BREAKPOINTS_MASTER_CSS = {
  '3xs': 360,
  '2xs': 480,
  xs: 600,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1440,
  '2xl': 1600,
  '3xl': 1920,
  '4xl': 2560
};
/** Breakpoints from PrimeFlex */
export const BREAKPOINTS_PRIME_FLEX = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};
