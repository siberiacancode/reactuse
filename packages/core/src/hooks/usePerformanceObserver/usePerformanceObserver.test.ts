import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { usePerformanceObserver } from './usePerformanceObserver';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

let observerCallback: PerformanceObserverCallback;

const createMockPerformanceEntry = (
  name = 'test-entry',
  entryType = 'measure',
  startTime = 0,
  duration = 100
): PerformanceEntry => ({
  name,
  entryType,
  startTime,
  duration,
  toJSON: () => ({})
});

class MockPerformanceObserver {
  constructor(callback: PerformanceObserverCallback) {
    observerCallback = callback;
  }

  observe = (options?: PerformanceObserverInit) => mockObserve(options);
  disconnect = () => mockDisconnect();
}

globalThis.PerformanceObserver = MockPerformanceObserver as any;

afterEach(() => {
  vi.clearAllMocks();
});

it('Should use performance observer', () => {
  const { result } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(result.current.supported).toBe(true);
  expect(result.current.entries).toEqual([]);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should use performance observer on server side', () => {
  const { result } = renderHookServer(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(result.current.supported).toBe(false);
  expect(result.current.entries).toEqual([]);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should start observing when immediate is true', () => {
  renderHook(() => usePerformanceObserver({ entryTypes: ['measure'], immediate: true }));

  expect(mockObserve).toHaveBeenCalledOnce();
  expect(mockObserve).toHaveBeenCalledWith(expect.objectContaining({ entryTypes: ['measure'] }));
});

it('Should not start observing when immediate is not set', () => {
  renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(mockObserve).not.toHaveBeenCalled();
});

it('Should start, stop and restart observer manually', () => {
  const { result } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(mockObserve).not.toHaveBeenCalled();

  act(() => result.current.start());

  expect(mockObserve).toHaveBeenCalledOnce();

  act(() => result.current.stop());

  expect(mockDisconnect).toHaveBeenCalledOnce();

  act(() => result.current.start());

  expect(mockObserve).toHaveBeenCalledTimes(2);
});

it('Should call callback when performance entries are observed', () => {
  const callback = vi.fn();

  renderHook(() => usePerformanceObserver({ entryTypes: ['measure'], immediate: true }, callback));

  const entry = createMockPerformanceEntry();
  const entryList = { getEntries: () => [entry] } as PerformanceObserverEntryList;

  act(() => observerCallback(entryList, {} as PerformanceObserver));

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(entryList, expect.any(Object));
});

it('Should update entries state when performance entries are observed', () => {
  const { result } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'], immediate: true })
  );

  expect(result.current.entries).toEqual([]);

  const entry = createMockPerformanceEntry('paint', 'measure', 0, 50);
  const entryList = { getEntries: () => [entry] } as PerformanceObserverEntryList;

  act(() => observerCallback(entryList, {} as PerformanceObserver));

  expect(result.current.entries).toEqual([entry]);
});

it('Should disconnect observer on unmount', () => {
  const { unmount } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'], immediate: true })
  );

  unmount();

  expect(mockDisconnect).toHaveBeenCalledOnce();
});

it('Should not disconnect observer on unmount when not started', () => {
  const { unmount } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  unmount();

  expect(mockDisconnect).not.toHaveBeenCalled();
});

it('Should work without callback', () => {
  const { result } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'], immediate: true })
  );

  const entry = createMockPerformanceEntry();
  const entryList = { getEntries: () => [entry] } as PerformanceObserverEntryList;

  act(() => observerCallback(entryList, {} as PerformanceObserver));

  expect(result.current.entries).toEqual([entry]);
});

it('Should update entries state with multiple entries', () => {
  const { result } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'], immediate: true })
  );

  const entries = [
    createMockPerformanceEntry('first-paint', 'paint', 0, 10),
    createMockPerformanceEntry('api-call', 'measure', 100, 200),
    createMockPerformanceEntry('lcp', 'largest-contentful-paint', 50, 150)
  ];
  const entryList = { getEntries: () => entries } as PerformanceObserverEntryList;

  act(() => observerCallback(entryList, {} as PerformanceObserver));

  expect(result.current.entries).toEqual(entries);
  expect(result.current.entries).toHaveLength(3);
});
