import { act, renderHook } from '@testing-library/react';

import { useDevicePixelRatio } from './useDevicePixelRatio';

describe('useDevicePixelRatio', () => {
  describe('in unsupported environment', () => {
    it('should return supported as false when devicePixelRatio is not present', () => {
      const originalDPR = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        value: undefined,
        configurable: true
      });

      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.supported).toBeFalsy();
      expect(result.current.ratio).toBeNull();

      Object.defineProperty(window, 'devicePixelRatio', {
        value: originalDPR,
        configurable: true
      });
    });

    it('should return supported as false when matchMedia is not a function', () => {
      const originalMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true
      });

      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.supported).toBeFalsy();
      expect(result.current.ratio).toBeNull();

      Object.defineProperty(window, 'matchMedia', {
        value: originalMatchMedia,
        writable: true
      });
    });
  });

  describe('in supported environment', () => {
    let originalMatchMedia: typeof window.matchMedia;
    let originalDPR: number;
    const mediaQueryListMock = {
      matches: false,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    };

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
      originalDPR = window.devicePixelRatio;

      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        configurable: true
      });

      window.matchMedia = vi
        .fn<[string], MediaQueryList>()
        .mockImplementation((query) => ({ ...mediaQueryListMock, media: query }));
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
      Object.defineProperty(window, 'devicePixelRatio', {
        value: originalDPR,
        configurable: true
      });
    });

    it('should return initial devicePixelRatio and supported', () => {
      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.supported).toBeTruthy();
      expect(result.current.ratio).toEqual(2);
    });

    it('should return ratio when devicePixelRatio changes', () => {
      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.ratio).toEqual(2);

      const listener = mediaQueryListMock.addEventListener.mock.calls[0][1];
      expect(typeof listener).toEqual('function');

      Object.defineProperty(window, 'devicePixelRatio', {
        value: 3,
        configurable: true
      });

      act(() => {
        listener(new MediaQueryListEvent('change'));
      });

      expect(result.current.ratio).toEqual(3);
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useDevicePixelRatio());

      expect(mediaQueryListMock.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      unmount();

      expect(mediaQueryListMock.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });
});
