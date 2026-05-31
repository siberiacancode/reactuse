import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useIdle } from './useIdle';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
});

it('Should use idle', () => {
  const { result } = renderHook(useIdle);

  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should use idle on server side', () => {
  const { result } = renderHookServer(useIdle);

  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be true after 60e3', () => {
  const { result } = renderHook(useIdle);
  expect(result.current.idle).toBeFalsy();

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();
});

it('Should set initial state', () => {
  const { result } = renderHook(() => useIdle(60e3, { initialValue: true }));
  expect(result.current.idle).toBeTruthy();
});

it('Should be false after interaction', () => {
  const { result } = renderHook(() => useIdle(60e3));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => window.dispatchEvent(new Event('mousemove')));

  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should be false after visibilitychange event', () => {
  const { result } = renderHook(() => useIdle(60e3));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current.idle).toBeFalsy();
  expect(result.current.lastActive).toBeLessThanOrEqual(Date.now());
});

it('Should work with custom events', () => {
  const { result } = renderHook(() => useIdle(60e3, { events: ['mousedown'] }));

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => window.dispatchEvent(new Event('mousedown')));
  expect(result.current.idle).toBeFalsy();

  act(() => vi.advanceTimersByTime(60e3));
  expect(result.current.idle).toBeTruthy();

  act(() => document.dispatchEvent(new Event('mousemove')));
  expect(result.current.idle).toBeTruthy();
});

it('Should call callback when idle state changes', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useIdle(60e3, callback));

  expect(callback).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(60e3));

  expect(result.current.idle).toBeTruthy();
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenLastCalledWith(true);

  act(() => window.dispatchEvent(new Event('mousemove')));

  expect(result.current.idle).toBeFalsy();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith(false);
});

it('Should call onChange option when idle state changes', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useIdle(60e3, { onChange }));

  expect(onChange).not.toHaveBeenCalled();

  act(() => vi.advanceTimersByTime(60e3));

  expect(result.current.idle).toBeTruthy();
  expect(onChange).toHaveBeenCalledOnce();
  expect(onChange).toHaveBeenLastCalledWith(true);
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const removeDocumentEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  const { unmount } = renderHook(useIdle);

  expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
  expect(removeEventListenerSpy).not.toHaveBeenCalled();

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  expect(removeDocumentEventListenerSpy).toHaveBeenCalledWith(
    'visibilitychange',
    expect.any(Function)
  );
});
