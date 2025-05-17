import { useEffect } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The breakpoints type */
export type Breakpoints<Breakpoint extends string = string> = Record<Breakpoint, number>;

/** The use breakpoints strategy */
export type UseBreakpointsStrategy = 'desktop-first' | 'mobile-first';

const match = (query: string) => window.matchMedia(query).matches;

/** The use breakpoints return type */
export type UseBreakpointsReturn<Breakpoint extends string = string> = {
  /** The function that checks if the current breakpoint is greater than to the given breakpoint */
  greater: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is greater than or equal to the given breakpoint */
  greaterOrEqual: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is smaller than to the given breakpoint */
  smaller: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is smaller than or equal to the given breakpoint */
  smallerOrEqual: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is between to the given breakpoints */
  between: (a: Breakpoint, b: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is greater than to the given breakpoint */
  isGreater: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is greater than or equal to the given breakpoint */
  isGreaterOrEqual: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is smaller than to the given breakpoint */
  isSmaller: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is smaller than or equal to the given breakpoint */
  isSmallerOrEqual: (breakpoint: Breakpoint) => boolean;
  /** The function that checks if the current breakpoint is between to the given breakpoints */
  isInBetween: (a: Breakpoint, b: Breakpoint) => boolean;
  /** The function that returns the current breakpoints */
  current: () => Breakpoint[];
  /** The function that returns the current active breakpoint */
  active: () => Breakpoint;
} & Record<Breakpoint, boolean>;

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
export const useBreakpoints = <Breakpoint extends string>(
  breakpoints: Breakpoints<Breakpoint>,
  strategy: UseBreakpointsStrategy = 'mobile-first'
): UseBreakpointsReturn<Breakpoint> => {
  const rerender = useRerender();

  const getValue = (breakpoint: Breakpoint, delta?: number) => {
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

  const greaterOrEqual = (breakpoint: Breakpoint) => match(`(min-width: ${getValue(breakpoint)})`);
  const smallerOrEqual = (breakpoint: Breakpoint) => match(`(max-width: ${getValue(breakpoint)})`);
  const current = () =>
    Object.keys(breakpoints)
      .map((breakpoint) => [breakpoint, greaterOrEqual(breakpoint as Breakpoint)])
      .filter(([, value]) => value)
      .map(([breakpoint]) => breakpoint) as Breakpoint[];
  const active = () => {
    const breakpoints = current();
    return (breakpoints.length ? breakpoints.at(-1) : undefined) as Breakpoint;
  };

  const greater = (breakpoint: Breakpoint) => match(`(min-width: ${getValue(breakpoint, 0.1)})`);
  const smaller = (breakpoint: Breakpoint) => match(`(max-width: ${getValue(breakpoint, -0.1)})`);
  const between = (a: Breakpoint, b: Breakpoint) =>
    match(`(min-width: ${getValue(a)}) and (max-width: ${getValue(b, -0.1)})`);

  const breakpointsKeys = (Object.keys(breakpoints) as Breakpoint[]).reduce(
    (acc, breakpoint) => {
      const value =
        strategy === 'mobile-first' ? greaterOrEqual(breakpoint) : smallerOrEqual(breakpoint);
      acc[breakpoint] = value;
      return acc;
    },
    {} as Record<Breakpoint, boolean>
  );

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
