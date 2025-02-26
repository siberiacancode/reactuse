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

export {
  BREAKPOINTS_ANT_DESIGN,
  BREAKPOINTS_BOOTSTRAP_V5,
  BREAKPOINTS_MANTINE,
  BREAKPOINTS_MASTER_CSS,
  BREAKPOINTS_MATERIAL_UI,
  BREAKPOINTS_PRIME_FLEX,
  BREAKPOINTS_QUASAR_V2,
  BREAKPOINTS_SEMANTIC,
  BREAKPOINTS_TAILWIND
} from './helpers';
