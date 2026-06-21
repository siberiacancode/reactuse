import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWindowSize } from './useWindowSize';

it('Should use window size', () => {
  const mockWindowInnerHeight = vi.spyOn(window, 'innerHeight', 'get');
  const mockWindowInnerWidth = vi.spyOn(window, 'innerWidth', 'get');

  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);

  const { result } = renderHook(useWindowSize);

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot).toEqual({ width: 100, height: 100 });
});

it('Should use window size on server side', () => {
  const { result } = renderHookServer(useWindowSize);

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot).toEqual({
    width: Number.POSITIVE_INFINITY,
    height: Number.POSITIVE_INFINITY
  });
});

it('Should return reactive value on watch', () => {
  const mockWindowInnerHeight = vi.spyOn(window, 'innerHeight', 'get');
  const mockWindowInnerWidth = vi.spyOn(window, 'innerWidth', 'get');

  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);
  const { result } = renderHook(useWindowSize);

  act(() => result.current.watch());

  act(() => {
    mockWindowInnerHeight.mockReturnValue(50);
    mockWindowInnerWidth.mockReturnValue(50);
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.snapshot).toEqual({ width: 50, height: 50 });
});

it('Should call callback on resize', () => {
  const callback = vi.fn();
  const mockWindowInnerHeight = vi.spyOn(window, 'innerHeight', 'get');
  const mockWindowInnerWidth = vi.spyOn(window, 'innerWidth', 'get');

  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);

  renderHook(() => useWindowSize(callback));

  act(() => {
    mockWindowInnerHeight.mockReturnValue(50);
    mockWindowInnerWidth.mockReturnValue(50);
    window.dispatchEvent(new Event('resize'));
  });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith({ width: 50, height: 50 }, expect.any(Event));
});

it('Should not include scrollbar', () => {
  const mockWindowClientHeight = vi.spyOn(window.document.documentElement, 'clientHeight', 'get');
  const mockWindowClientWidth = vi.spyOn(window.document.documentElement, 'clientWidth', 'get');

  mockWindowClientHeight.mockReturnValue(100);
  mockWindowClientWidth.mockReturnValue(100);
  const { result } = renderHook(() => useWindowSize({ includeScrollbar: false }));

  act(() => result.current.watch());
  expect(result.current.snapshot).toEqual({ width: 100, height: 100 });
  act(() => {
    mockWindowClientHeight.mockReturnValue(50);
    mockWindowClientWidth.mockReturnValue(50);
    window.dispatchEvent(new Event('resize'));
  });
  expect(result.current.snapshot).toEqual({ width: 50, height: 50 });
});

it('Should cleanup up on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useWindowSize());

  expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
});
