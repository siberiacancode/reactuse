import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useMemory } from './useMemory';

beforeEach(() => {
  vi.useFakeTimers();

  Object.defineProperty(globalThis.performance, 'memory', {
    writable: true,
    value: {
      jsHeapSizeLimit: 2147483648,
      totalJSHeapSize: 1073741824,
      usedJSHeapSize: 536870912
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use memory', () => {
  const { result } = renderHook(useMemory);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.value).toEqual({
    jsHeapSizeLimit: 2147483648,
    totalJSHeapSize: 1073741824,
    usedJSHeapSize: 536870912
  });
});

it('Should use memory for unsupported', () => {
  Object.defineProperty(globalThis.performance, 'memory', {
    writable: true,
    value: undefined
  });

  const { result } = renderHookServer(useMemory);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toEqual({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0
  });
});

it('Should use memory on server side', () => {
  const { result } = renderHookServer(useMemory);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toEqual({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0
  });
});

it('Should use memory when performance.memory is not supported', () => {
  Object.defineProperty(globalThis.performance, 'memory', {
    writable: true,
    value: undefined
  });

  const { result } = renderHook(useMemory);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toEqual({
    jsHeapSizeLimit: 0,
    totalJSHeapSize: 0,
    usedJSHeapSize: 0
  });
});

it('Should update memory values when they change', () => {
  const { result } = renderHook(useMemory);

  const updatedMemory = {
    jsHeapSizeLimit: 2147483648,
    totalJSHeapSize: 1073741824,
    usedJSHeapSize: 671088640
  };

  Object.defineProperty(globalThis.performance, 'memory', {
    writable: true,
    value: updatedMemory
  });

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.value).toEqual(updatedMemory);
});

it('Should cleanup up on unmount', () => {
  const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
  const { unmount } = renderHook(useMemory);

  unmount();

  expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
});
