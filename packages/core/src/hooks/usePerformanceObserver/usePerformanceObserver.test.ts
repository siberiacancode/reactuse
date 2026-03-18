import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';

import { usePerformanceObserver } from './usePerformanceObserver';

const PERFORMANCE_OBSERVER_KEY = 'performance-observer';
const trigger = createTrigger<string, PerformanceObserverCallback>();

const mockPerformanceObserverObserve = vi.fn();
const mockPerformanceObserverDisconnect = vi.fn();

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
    this.callback = callback;
  }

  callback: PerformanceObserverCallback;

  observe = (options?: PerformanceObserverInit) => {
    trigger.add(PERFORMANCE_OBSERVER_KEY, this.callback);
    mockPerformanceObserverObserve(options);
  };

  disconnect = () => {
    trigger.delete(PERFORMANCE_OBSERVER_KEY);
    mockPerformanceObserverDisconnect();
  };
}

globalThis.PerformanceObserver = MockPerformanceObserver as any;

beforeEach(() => {
  trigger.clear();
});

it('Should use performance observer', () => {
  const { result } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(result.current.supported).toBe(true);
  expect(result.current.entries).toEqual([]);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.observer).toBeUndefined();
});

it('Should use performance observer on server side', () => {
  const { result } = renderHookServer(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  expect(result.current.supported).toBe(false);
  expect(result.current.entries).toEqual([]);
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
  expect(result.current.observer).toBeUndefined();
});

it('Should start observing when immediate', () => {
  renderHook(() => usePerformanceObserver({ entryTypes: ['measure'], immediate: true }));

  expect(mockPerformanceObserverObserve).toHaveBeenCalledOnce();
  expect(mockPerformanceObserverObserve).toHaveBeenCalledWith(
    expect.objectContaining({ entryTypes: ['measure'] })
  );
});

it('Should restart observer manually', () => {
  const { result } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  const entry = createMockPerformanceEntry();
  const entryList = {
    getEntries: () => [entry]
  } as PerformanceObserverEntryList;

  act(() => {
    result.current.start();
    trigger.callback(PERFORMANCE_OBSERVER_KEY, entryList, result.current.observer!);
  });

  expect(result.current.entries).toEqual([entry]);

  expect(mockPerformanceObserverObserve).toHaveBeenCalledOnce();

  act(result.current.stop);

  expect(mockPerformanceObserverDisconnect).toHaveBeenCalledOnce();
});

it('Should call callback when performance entries are observed', () => {
  const callback = vi.fn();

  const { result } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'] }, callback)
  );

  const entry = createMockPerformanceEntry();
  const entryList = {
    getEntries: () => [entry]
  } as PerformanceObserverEntryList;

  act(() => {
    result.current.start();
    trigger.callback(PERFORMANCE_OBSERVER_KEY, entryList, result.current.observer);
  });

  expect(result.current.observer).toBeTruthy();

  expect(result.current.entries).toEqual([entry]);
  expect(callback).toHaveBeenCalledOnce();
});

it('Should not disconnect observer on unmount when not started', () => {
  const { unmount } = renderHook(() => usePerformanceObserver({ entryTypes: ['measure'] }));

  unmount();

  expect(mockPerformanceObserverDisconnect).not.toHaveBeenCalled();
});

it('Should disconnect observer on unmount', () => {
  const { unmount } = renderHook(() =>
    usePerformanceObserver({ entryTypes: ['measure'], immediate: true })
  );

  unmount();

  expect(mockPerformanceObserverDisconnect).toHaveBeenCalledOnce();
});
