import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useRaf } from './useRaf';

it('Should use raf', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useRaf(callback));

  expect(result.current.active).toBeTruthy();
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
});

it('Should use raf on server side', () => {
  const callback = vi.fn();
  const { result } = renderHookServer(() => useRaf(callback));

  expect(result.current.active).toBeFalsy();
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
});

it('Should start request animation frame by default', () => {
  const mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');

  renderHook(() => useRaf(vi.fn()));

  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
});

it('Should not start when disabled', () => {
  const mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
  const { result } = renderHook(() => useRaf(vi.fn(), { enabled: false }));

  expect(result.current.active).toBeFalsy();
  expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
});

it('Should pause animation frame', () => {
  const mockCancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
  const { result } = renderHook(() => useRaf(vi.fn()));

  act(result.current.pause);

  expect(result.current.active).toBeFalsy();
  expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
});

it('Should resume animation frame after pause', () => {
  const mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
  const { result } = renderHook(() => useRaf(vi.fn()));

  expect(result.current.active).toBeTruthy();

  act(result.current.pause);
  expect(result.current.active).toBeFalsy();

  act(result.current.resume);

  expect(result.current.active).toBeTruthy();
  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);
});

it('Should handle enabled changes', () => {
  const mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
  const { result, rerender } = renderHook((enabled) => useRaf(vi.fn(), { enabled }), {
    initialProps: false
  });

  expect(result.current.active).toBeFalsy();
  expect(mockRequestAnimationFrame).not.toHaveBeenCalled();

  rerender(true);

  expect(result.current.active).toBeTruthy();
  expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
});

it('Should cleanup on unmount', () => {
  const mockCancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
  const { unmount } = renderHook(() => useRaf(vi.fn()));

  unmount();

  expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1);
});
