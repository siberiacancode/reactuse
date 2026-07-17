import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWakeLock } from './useWakeLock';

class MockWakeLockSentinel extends EventTarget {
  release = vi.fn().mockResolvedValue(undefined);
}

const mockWakeLockRequest = vi.fn();

beforeEach(() => {
  Object.defineProperty(globalThis.navigator, 'wakeLock', {
    value: {
      request: mockWakeLockRequest
    },
    writable: true
  });

  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    configurable: true
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use wake lock', () => {
  const { result } = renderHook(useWakeLock);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.request).toBeTypeOf('function');
  expect(result.current.release).toBeTypeOf('function');
});

it('Should use wake lock on server side', () => {
  const { result } = renderHookServer(useWakeLock);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
  expect(result.current.request).toBeTypeOf('function');
  expect(result.current.release).toBeTypeOf('function');
});

it('Should use wake lock for unsupported', () => {
  Object.defineProperty(globalThis.navigator, 'wakeLock', {
    value: undefined,
    writable: true
  });

  const { result } = renderHook(useWakeLock);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.active).toBeFalsy();
});

it('Should handle request', async () => {
  const sentinel = new MockWakeLockSentinel();
  mockWakeLockRequest.mockResolvedValue(sentinel);

  const { result } = renderHook(useWakeLock);

  await act(result.current.request);

  expect(mockWakeLockRequest).toHaveBeenCalledWith(undefined);
  expect(result.current.active).toBeTruthy();
});

it('Should handle request with custom type', async () => {
  const sentinel = new MockWakeLockSentinel();
  mockWakeLockRequest.mockResolvedValue(sentinel);

  const { result } = renderHook(() => useWakeLock({ type: 'screen' }));

  await act(() => result.current.request('screen'));

  expect(mockWakeLockRequest).toHaveBeenCalledWith('screen');
  expect(result.current.active).toBeTruthy();
});

it('Should handle release', async () => {
  const sentinel = new MockWakeLockSentinel();
  mockWakeLockRequest.mockResolvedValue(sentinel);

  const { result } = renderHook(useWakeLock);

  await act(result.current.request);

  expect(result.current.active).toBeTruthy();

  await act(result.current.release);

  expect(sentinel.release).toHaveBeenCalledOnce();
  expect(result.current.active).toBeFalsy();
});

it('Should react to release event', async () => {
  const sentinel = new MockWakeLockSentinel();
  mockWakeLockRequest.mockResolvedValue(sentinel);

  const { result } = renderHook(useWakeLock);

  await act(result.current.request);

  expect(result.current.active).toBeTruthy();

  act(() => sentinel.dispatchEvent(new Event('release')));

  expect(result.current.active).toBeFalsy();
});

it('Should handle visibilitychange event when immediately enabled', async () => {
  const firstSentinel = new MockWakeLockSentinel();
  const secondSentinel = new MockWakeLockSentinel();

  mockWakeLockRequest.mockResolvedValueOnce(firstSentinel).mockResolvedValueOnce(secondSentinel);

  const { result } = renderHook(() => useWakeLock({ immediately: true, type: 'screen' }));

  await act(result.current.request);

  expect(result.current.active).toBeTruthy();

  await act(async () => {
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(firstSentinel.release).toHaveBeenCalledOnce();
  expect(mockWakeLockRequest).toHaveBeenCalledTimes(2);
  expect(mockWakeLockRequest).toHaveBeenLastCalledWith('screen');
  expect(result.current.active).toBeTruthy();
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

  const { unmount } = renderHook(() => useWakeLock({ immediately: true, type: 'screen' }));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
});
