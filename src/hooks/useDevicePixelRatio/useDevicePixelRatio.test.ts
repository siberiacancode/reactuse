import { act, renderHook } from '@testing-library/react';

import { useDevicePixelRatio } from './useDevicePixelRatio';

describe('useDevicePixelRatio', () => {
  describe('in unsupported environment', () => {
    afterEach(() => void vi.unstubAllGlobals());

    it('should return supported as false when devicePixelRatio is not present', () => {
      vi.stubGlobal('devicePixelRatio', undefined);
      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.supported).toBeFalsy();
      expect(result.current.ratio).toBeNull();
    });

    it('should return supported as false when matchMedia is not a function', () => {
      vi.stubGlobal('matchMedia', undefined);
      const { result } = renderHook(() => useDevicePixelRatio());
      expect(result.current.supported).toBeFalsy();
      expect(result.current.ratio).toBeNull();
    });
  });

  describe('in supported environment', () => {
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
      vi.stubGlobal('devicePixelRatio', 2);
      vi.stubGlobal(
        'matchMedia',
        vi
          .fn<[string], MediaQueryList>()
          .mockImplementation((query) => ({ ...mediaQueryListMock, media: query }))
      );
    });

    afterEach(() => void vi.unstubAllGlobals());

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
