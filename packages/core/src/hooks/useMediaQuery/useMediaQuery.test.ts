import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useMediaQuery } from './useMediaQuery';

const trigger = createTrigger<string, () => void>();
const mockMatchMedia = {
  matches: false,
  media: '(max-width: 768px)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    if (trigger.get(type) === callback) {
      trigger.delete(type);
    }
  },
  dispatchEvent: vi.fn()
};

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      mockMatchMedia.media = query;
      return mockMatchMedia;
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use media query"', () => {
  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toBe(false);
});

it('Should use media query on server', () => {
  const { result } = renderHookServer(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toBe(false);
});

it('Should return true if media query matches', () => {
  mockMatchMedia.matches = true;

  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);
});

it('returns false if media query does not match after change', async () => {
  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);

  mockMatchMedia.matches = false;
  act(() => trigger.callback('change'));

  expect(result.current).toEqual(false);
});
