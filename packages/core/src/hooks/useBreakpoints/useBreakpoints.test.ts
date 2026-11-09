import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import type { UseBreakpointsStrategy } from './useBreakpoints';

import {
  BREAKPOINTS_ANT_DESIGN,
  BREAKPOINTS_BOOTSTRAP_V5,
  BREAKPOINTS_MANTINE,
  BREAKPOINTS_MASTER_CSS,
  BREAKPOINTS_MATERIAL_UI,
  BREAKPOINTS_PRIME_FLEX,
  BREAKPOINTS_QUASAR_V2,
  BREAKPOINTS_SEMANTIC,
  BREAKPOINTS_TAILWIND,
  useBreakpoints
} from './useBreakpoints';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMediaInstances = new Map<string, { matches: boolean; media: string }>();

const mockMatchMedia = vi.fn((query: string) => {
  const instance = {
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (type: string, callback: () => void) => {
      mockAddEventListener(type, callback);
      trigger.add(query, callback);
    },
    removeEventListener: (type: string, callback: () => void) => {
      mockRemoveEventListener(type, callback);
      if (trigger.get(query) === callback) trigger.delete(query);
    },
    dispatchEvent: vi.fn(),
    get matches() {
      const stored = mockMatchMediaInstances.get(query);
      return stored?.matches ?? false;
    }
  };
  return instance;
});

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia
  });
});

afterEach(() => {
  mockMatchMediaInstances.clear();
  trigger.clear();
});

const breakpoints = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280
};

it('Should use breakpoints', () => {
  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.greater).toBeTypeOf('function');
  expect(result.current.greaterOrEqual).toBeTypeOf('function');
  expect(result.current.smaller).toBeTypeOf('function');
  expect(result.current.smallerOrEqual).toBeTypeOf('function');
  expect(result.current.between).toBeTypeOf('function');
  expect(result.current.current).toBeTypeOf('function');
  expect(result.current.active).toBeTypeOf('function');
  expect(result.current.mobile).toBeTypeOf('boolean');
  expect(result.current.tablet).toBeTypeOf('boolean');
  expect(result.current.laptop).toBeTypeOf('boolean');
  expect(result.current.desktop).toBeTypeOf('boolean');
});

it('Should use breakpoints on server side', () => {
  const { result } = renderHookServer(() => useBreakpoints(breakpoints));

  expect(result.current.mobile).toBeFalsy();
  expect(result.current.tablet).toBeFalsy();
  expect(result.current.laptop).toBeFalsy();
  expect(result.current.desktop).toBeFalsy();
  expect(result.current.greater).toBeTypeOf('function');
  expect(result.current.greaterOrEqual).toBeTypeOf('function');
  expect(result.current.smaller).toBeTypeOf('function');
  expect(result.current.smallerOrEqual).toBeTypeOf('function');
  expect(result.current.between).toBeTypeOf('function');
  expect(result.current.current).toBeTypeOf('function');
  expect(result.current.active).toBeTypeOf('function');
});

it('Should return correct values for greaterOrEqual', () => {
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: false,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.greaterOrEqual('mobile')).toBeTruthy();
  expect(result.current.greaterOrEqual('tablet')).toBeFalsy();
});

it('Should return correct values for smallerOrEqual', () => {
  const tabletQuery = '(max-width: 640px)';
  const desktopQuery = '(max-width: 1280px)';

  mockMatchMediaInstances.set(tabletQuery, {
    matches: true,
    media: tabletQuery
  });
  mockMatchMediaInstances.set(desktopQuery, {
    matches: false,
    media: desktopQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.smallerOrEqual('tablet')).toBeTruthy();
  expect(result.current.smallerOrEqual('desktop')).toBeFalsy();
});

it('Should return correct values for greater', () => {
  const mobileQuery = '(min-width: 0.1px)';
  const tabletQuery = '(min-width: 640.1px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: false,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.greater('mobile')).toBeTruthy();
  expect(result.current.greater('tablet')).toBeFalsy();
});

it('Should return correct values for smaller', () => {
  const mobileQuery = '(max-width: -0.1px)';
  const tabletQuery = '(max-width: 639.9px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: false,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: true,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.smaller('mobile')).toBeFalsy();
  expect(result.current.smaller('tablet')).toBeTruthy();
});

it('Should return correct values for between', () => {
  const tabletToLaptopQuery = '(min-width: 640px) and (max-width: 1023.9px)';

  mockMatchMediaInstances.set(tabletToLaptopQuery, {
    matches: true,
    media: tabletToLaptopQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.between('tablet', 'laptop')).toBeTruthy();
});

it('Should return correct current breakpoints', () => {
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: true,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.current()).toEqual(['mobile', 'tablet']);
});

it('Should return correct active breakpoint', () => {
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: true,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.active()).toBe('tablet');
});

it('Should return no active breakpoint when none match', () => {
  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.current()).toEqual([]);
  expect(result.current.active()).toBeUndefined();
});

it('Should use mobile-first strategy by default', () => {
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: false,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.mobile).toBeTruthy();
  expect(result.current.tablet).toBeFalsy();
});

it('Should use desktop-first strategy when specified', () => {
  const tabletQuery = '(max-width: 640px)';
  const desktopQuery = '(max-width: 1280px)';

  mockMatchMediaInstances.set(tabletQuery, {
    matches: false,
    media: tabletQuery
  });
  mockMatchMediaInstances.set(desktopQuery, {
    matches: true,
    media: desktopQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints, 'desktop-first'));

  expect(result.current.tablet).toBeFalsy();
  expect(result.current.desktop).toBeTruthy();
});

it('Should update on resize events', () => {
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: false,
    media: tabletQuery
  });

  const { result } = renderHook(() => useBreakpoints(breakpoints));

  expect(result.current.tablet).toBeFalsy();

  act(() => {
    mockMatchMediaInstances.set(tabletQuery, {
      matches: true,
      media: tabletQuery
    });
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.tablet).toBeTruthy();
});

it('Should handle breakpoint changes', () => {
  const initialBreakpoints: Record<string, number> = { mobile: 0 };
  const nextBreakpoints: Record<string, number> = { tablet: 640 };
  const mobileQuery = '(min-width: 0px)';
  const tabletQuery = '(min-width: 640px)';

  mockMatchMediaInstances.set(mobileQuery, {
    matches: true,
    media: mobileQuery
  });
  mockMatchMediaInstances.set(tabletQuery, {
    matches: true,
    media: tabletQuery
  });

  const { result, rerender } = renderHook((breakpoints) => useBreakpoints(breakpoints), {
    initialProps: initialBreakpoints
  });

  expect(result.current.mobile).toBeTruthy();

  rerender(nextBreakpoints);

  expect(result.current).not.toHaveProperty('mobile');
  expect(result.current.tablet).toBeTruthy();
});

it('Should handle strategy changes', () => {
  const tabletMinQuery = '(min-width: 640px)';
  const tabletMaxQuery = '(max-width: 640px)';

  mockMatchMediaInstances.set(tabletMinQuery, {
    matches: true,
    media: tabletMinQuery
  });
  mockMatchMediaInstances.set(tabletMaxQuery, {
    matches: false,
    media: tabletMaxQuery
  });

  const { result, rerender } = renderHook(
    (strategy: UseBreakpointsStrategy) => useBreakpoints(breakpoints, strategy),
    { initialProps: 'mobile-first' as UseBreakpointsStrategy }
  );

  expect(result.current.tablet).toBeTruthy();

  rerender('desktop-first');

  expect(result.current.tablet).toBeFalsy();
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useBreakpoints(breakpoints));

  expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
});

it('Should expose breakpoint presets', () => {
  expect(BREAKPOINTS_MATERIAL_UI).toEqual({ xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 });
  expect(BREAKPOINTS_MANTINE).toEqual({ xs: 576, sm: 768, md: 992, lg: 1200, xl: 1408 });
  expect(BREAKPOINTS_TAILWIND).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 });
  expect(BREAKPOINTS_BOOTSTRAP_V5).toEqual({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  });
  expect(BREAKPOINTS_ANT_DESIGN).toEqual({
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  });
  expect(BREAKPOINTS_QUASAR_V2).toEqual({ xs: 0, sm: 600, md: 1024, lg: 1440, xl: 1920 });
  expect(BREAKPOINTS_SEMANTIC).toEqual({
    mobileS: 320,
    mobileM: 375,
    mobileL: 425,
    tablet: 768,
    laptop: 1024,
    laptopL: 1440,
    desktop4K: 2560
  });
  expect(BREAKPOINTS_MASTER_CSS).toEqual({
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
  });
  expect(BREAKPOINTS_PRIME_FLEX).toEqual({ sm: 576, md: 768, lg: 992, xl: 1200 });
});
