import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useMediaQuery } from './useMediaQuery';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: '(max-width: 768px)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
});

it('Should use media query"', () => {
  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(typeof result.current).toBe('boolean');
});

it('Should use media query on server', () => {
  const { result } = renderHookServer(() => useMediaQuery('(max-width: 768px)'));

  expect(typeof result.current).toBe('boolean');
});

it('should return true if media query matches', () => {
  const mockMediaQueryList = mockMatchMedia(true);

  const matchMediaSpy = vi.spyOn(window, 'matchMedia');
  matchMediaSpy.mockReturnValue(mockMediaQueryList);

  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);
});

it('should return false if media query does not matches', () => {
  const mockMediaQueryList = mockMatchMedia(false);

  const matchMediaSpy = vi.spyOn(window, 'matchMedia');
  matchMediaSpy.mockReturnValue(mockMediaQueryList);

  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(false);
});

it('returns false if media query does not match after change', () => {
  const mockMediaQueryList = mockMatchMedia(true);

  const matchMediaSpy = vi.spyOn(window, 'matchMedia');
  matchMediaSpy.mockReturnValue(mockMediaQueryList);

  const { result, rerender } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);

  act(() => {
    mockMediaQueryList.matches = false;
    mockMediaQueryList.dispatchEvent(new Event('ResizeEvent'));
  });

  rerender();

  expect(result.current).toEqual(false);
});
