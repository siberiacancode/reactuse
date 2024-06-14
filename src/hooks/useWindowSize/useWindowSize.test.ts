import { act, renderHook } from '@testing-library/react';

import { useWindowSize } from './useWindowSize';

const mockWindowInnerHeight = vi.spyOn(window, 'innerHeight', 'get');
const mockWindowInnerWidth = vi.spyOn(window, 'innerWidth', 'get');

it('Should use window size', () => {
  mockWindowInnerHeight.mockReturnValue(100);
  mockWindowInnerWidth.mockReturnValue(100);

  const { result } = renderHook(useWindowSize);

  expect(result.current).toEqual({ width: 100, height: 100 });
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
