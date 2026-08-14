---
title: useBreakpoints
description: Hook that manages breakpoints
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1766052966000
---

# useBreakpoints

Hook that manages breakpoints

## Demo

```tsx
import { useBreakpoints } from '@siberiacancode/reactuse';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

const PRODUCTS = [
  { emoji: '🪴', name: 'Monstera', price: '$24' },
  { emoji: '🌵', name: 'Cactus', price: '$12' },
  { emoji: '🌸', name: 'Blossom', price: '$18' },
  { emoji: '🌻', name: 'Sunflower', price: '$9' },
  { emoji: '🍄', name: 'Mushroom', price: '$14' },
  { emoji: '🌴', name: 'Palm', price: '$32' }
];

const Demo = () => {
  const breakpoints = useBreakpoints(BREAKPOINTS);

  const current = breakpoints.current();

  return (
    <section className='flex justify-center p-6'>
      {current.includes('mobile') &&
        !current.includes('tablet') &&
        !current.includes('desktop') && (
          <div className='relative flex h-107.5 w-66 flex-col gap-4 overflow-hidden rounded-4xl border px-4 pt-12 pb-4'>
            <div className='bg-border absolute top-3 left-1/2 h-5 w-22 -translate-x-1/2 rounded-full' />

            <div className='flex items-center justify-between px-1'>
              <h3 className='text-3xl!'>Mobile view</h3>
            </div>

            <p className='text-muted-foreground px-1 text-sm'>
              Compact <code>mobile</code> layout for small screens. Stacked content, tap-friendly
              buttons, and short copy that respects narrow viewports.
            </p>

            <div className='flex flex-col gap-2'>
              {PRODUCTS.slice(0, 3).map((product) => (
                <div
                  key={product.name}
                  className='bg-muted flex items-center gap-3 rounded-2xl px-3 py-2'
                >
                  <div data-size='lg' data-slot='avatar'>
                    <span data-slot='avatar-fallback'>{product.emoji}</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{product.name}</p>
                    <p className='text-muted-foreground text-xs'>{product.price}</p>
                  </div>
                  <button className='rounded-lg px-2 py-1 text-xs' type='button'>
                    Add
                  </button>
                </div>
              ))}
              <p className='text-muted-foreground text-center text-xs'>+3 more</p>
            </div>
          </div>
        )}

      {current.includes('tablet') && !current.includes('desktop') && (
        <div className='relative flex h-[440px] w-96 flex-col gap-4 overflow-hidden rounded-3xl border px-5 pt-10 pb-5'>
          <div className='bg-border absolute top-4 left-1/2 size-2 -translate-x-1/2 rounded-full' />

          <div className='flex items-center justify-between'>
            <h3 className='text-xl!'>Tablet view</h3>
          </div>

          <p className='text-muted-foreground text-sm'>
            Balanced <code>tablet</code> layout for medium screens. More room for content with
            comfortable reading width and side margins.
          </p>

          <div className='grid grid-cols-2 gap-2'>
            {PRODUCTS.slice(0, 4).map((product) => (
              <div key={product.name} className='bg-muted flex flex-col gap-1.5 rounded-2xl p-3'>
                <div data-size='lg' data-slot='avatar'>
                  <span data-slot='avatar-fallback'>{product.emoji}</span>
                </div>
                <div>
                  <p className='text-sm font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>{product.price}</p>
                </div>
                <button className='rounded-lg py-1 text-xs font-medium' type='button'>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {current.includes('desktop') && (
        <div className='flex flex-col items-center'>
          <div className='relative flex h-80 w-[480px] flex-col gap-4 overflow-hidden rounded-xl border px-6 pt-9 pb-5'>
            <div className='bg-border absolute top-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-b-md' />

            <div className='flex items-center justify-between'>
              <h3 className='text-4xl!'>Desktop view</h3>
            </div>

            <p className='text-muted-foreground text-sm'>
              Wide <code>desktop</code> layout for large displays. Multi-column content, persistent
              sidebars, and rich detail panes for productivity.
            </p>

            <div className='mt-5 grid grid-cols-3 gap-2'>
              {PRODUCTS.map((product) => (
                <div key={product.name} className='bg-muted flex flex-col gap-1.5 rounded-xl p-2.5'>
                  <div data-slot='avatar'>
                    <span data-slot='avatar-fallback'>{product.emoji}</span>
                  </div>
                  <div>
                    <p className='text-xs font-medium'>{product.name}</p>
                    <p className='text-muted-foreground text-[10px]'>{product.price}</p>
                  </div>
                  <button className='rounded-lg py-0.5 text-[10px] font-medium' type='button'>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-muted h-1.5 w-[540px] rounded-b-lg' />
          <div className='bg-muted/60 -mt-1 h-1 w-20 rounded-b-md' />
        </div>
      )}
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useBreakpoints
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect } from 'react';

import { useRerender } from '../useRerender/useRerender';

/** The breakpoints type */
export type Breakpoints<Breakpoint extends string = string> = Record<Breakpoint, number>;

/** The use breakpoints strategy */
export type UseBreakpointsStrategy = 'desktop-first' | 'mobile-first';

const match = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;

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
  /** The function that returns the current breakpoints */
  current: () => Breakpoint[];
  /** The function that returns the current active breakpoint */
  active: () => Breakpoint;
} & Record<Breakpoint, boolean>;

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
 * const { greater, smaller, between, current, active, ...breakpoints } = useBreakpoints({ mobile: 0, tablet: 640, laptop: 1024, desktop: 1280 });
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
    const onResize = rerender;
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
```

Update the import paths to match your project setup.

## Usage

```tsx
const { greater, smaller, between, current, active, ...breakpoints } = useBreakpoints({ mobile: 0, tablet: 640, laptop: 1024, desktop: 1280 });
```

## Type Declarations

```tsx
export type Breakpoints<Breakpoint extends string = string> = Record<Breakpoint, number>;

export type UseBreakpointsStrategy = 'desktop-first' | 'mobile-first';

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
  /** The function that returns the current breakpoints */
  current: () => Breakpoint[];
  /** The function that returns the current active breakpoint */
  active: () => Breakpoint;
} & Record<Breakpoint, boolean>;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| breakpoints | `Breakpoints<Breakpoint>` | - | The breakpoints to use |
| strategy | `UseBreakpointsStrategy` | min-width | The strategy to use for matching |

### Returns

`UseBreakpointsReturn<Breakpoint>` - An object containing the current breakpoint