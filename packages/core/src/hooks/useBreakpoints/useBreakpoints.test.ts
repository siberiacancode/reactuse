import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';

import { useBreakpoints } from './useBreakpoints';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMediaInstances = new Map<string, { matches: boolean; media: string }>();

const mockMatchMedia = (query: string) => {
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
};

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia
  });
});

afterEach(vi.restoreAllMocks);

const breakpoints = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280
};

describe('useBreakpoints', () => {
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
      matches: true,
      media: desktopQuery
    });

    const { result } = renderHook(() => useBreakpoints(breakpoints));

    expect(result.current.smallerOrEqual('tablet')).toBeTruthy();
    expect(result.current.smallerOrEqual('desktop')).toBeTruthy();
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

    const current = result.current.current();
    expect(current).toContain('mobile');
    expect(current).toContain('tablet');
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

  it('Should cleanup on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useBreakpoints(breakpoints));

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
