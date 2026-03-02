import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { useMediaQuery } from './useMediaQuery';

const trigger = createTrigger<string, () => void>();
const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();
const mockMatchMedia = {
  matches: false,
  media: '(max-width: 768px)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: (type: string, callback: () => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  },
  removeEventListener: (type: string, callback: () => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
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

it('Should use media query"', () => {
  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toBeFalsy();
});

it('Should use media query on server', () => {
  const { result } = renderHookServer(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toBeFalsy();
});

it('Should return true if media query matches', () => {
  mockMatchMedia.matches = true;

  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);
});

it('Should return false if media query does not match after change', async () => {
  const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(result.current).toEqual(true);

  mockMatchMedia.matches = false;
  act(() => trigger.callback('change'));

  expect(result.current).toEqual(false);
});

it('Should handle query changes', () => {
  const { rerender } = renderHook((query) => useMediaQuery(query), {
    initialProps: '(max-width: 768px)'
  });

  expect(mockAddEventListener).toHaveBeenCalled();
  expect(mockRemoveEventListener).not.toHaveBeenCalledOnce();

  rerender('(min-width: 1024px)');

  expect(mockAddEventListener).toHaveBeenCalledTimes(2);
  expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
});

it('Should cleanup up on unmount', () => {
  const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
});

it('Should call addEventListener/removeEventListener once for same query', () => {
  const hook1 = renderHook(() => useMediaQuery('(max-width: 768px)'));
  const hook2 = renderHook(() => useMediaQuery('(max-width: 768px)'));
  const hook3 = renderHook(() => useMediaQuery('(max-width: 768px)'));

  expect(mockAddEventListener).toHaveBeenCalledTimes(1);

  hook1.unmount();
  hook2.unmount();
  hook3.unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
});

it('Should call addEventListener/removeEventListener for each unique query', () => {
  const hook1 = renderHook(() => useMediaQuery('(max-width: 768px)'));
  const hook2 = renderHook(() => useMediaQuery('(max-width: 768px)'));
  const hook3 = renderHook(() => useMediaQuery('(max-width: 992px)'));
  const hook4 = renderHook(() => useMediaQuery('(max-width: 992px)'));
  const hook5 = renderHook(() => useMediaQuery('(max-width: 1024px)'));
  const hook6 = renderHook(() => useMediaQuery('(max-width: 1024px)'));

  expect(mockAddEventListener).toHaveBeenCalledTimes(3);

  hook1.unmount();
  hook2.unmount();
  hook3.unmount();
  hook4.unmount();
  hook5.unmount();
  hook6.unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledTimes(3);
});
