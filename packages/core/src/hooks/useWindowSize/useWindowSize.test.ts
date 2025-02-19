import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWindowSize } from './useWindowSize';

const mockWindowInnerHeight = vi.spyOn(window, 'innerHeight', 'get');
const mockWindowInnerWidth = vi.spyOn(window, 'innerWidth', 'get');

const mockWindowClientHeight = vi.spyOn(window.document.documentElement, 'clientHeight', 'get');
const mockWindowClientWidth = vi.spyOn(window.document.documentElement, 'clientWidth', 'get');

it('Should use window size', () => {
  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);

  const { result } = renderHook(useWindowSize);

  expect(result.current).toEqual({ width: 100, height: 100 });
});

it('Should use window size on server side', () => {
  const { result } = renderHookServer(useWindowSize);

  expect(result.current).toEqual({
    width: Number.POSITIVE_INFINITY,
    height: Number.POSITIVE_INFINITY
  });
});

it('Should change state upon resize events', () => {
  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);
  const { result } = renderHook(useWindowSize);

  expect(result.current).toEqual({ width: 100, height: 100 });

  act(() => {
    mockWindowInnerHeight.mockReturnValue(50);
    mockWindowInnerWidth.mockReturnValue(50);
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current).toEqual({ width: 50, height: 50 });
});

it('Should not include scrollbar', () => {
  mockWindowClientHeight.mockReturnValue(100);
  mockWindowClientWidth.mockReturnValue(100);
  const { result } = renderHook(() => useWindowSize({ includeScrollbar: false }));

  expect(result.current).toEqual({ width: 100, height: 100 });
  act(() => {
    mockWindowClientHeight.mockReturnValue(50);
    mockWindowClientWidth.mockReturnValue(50);
    window.dispatchEvent(new Event('resize'));
  });
  expect(result.current).toEqual({ width: 50, height: 50 });
});
