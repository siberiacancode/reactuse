import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useFps } from './useFps';

let mockAnimationFrameCallback: FrameRequestCallback;
let mockAnimationFrameId: number;
let mockPerformanceNow: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mockAnimationFrameId = 0;
  mockPerformanceNow = vi.spyOn(performance, 'now').mockReturnValue(0);
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    mockAnimationFrameCallback = callback;
    mockAnimationFrameId += 1;
    return mockAnimationFrameId;
  });
});

it('Should use fps', () => {
  const { result } = renderHook(useFps);
  expect(result.current).toBe(0);
});

it('Should use fps on server side', () => {
  const { result } = renderHookServer(useFps);
  expect(result.current).toBe(0);
});

it('Should calculate fps', () => {
  const { result } = renderHook(useFps);

  mockPerformanceNow.mockReturnValue(400);
  act(() => mockAnimationFrameCallback(400));

  mockPerformanceNow.mockReturnValue(800);
  act(() => mockAnimationFrameCallback(800));

  expect(result.current).toBe(0);

  mockPerformanceNow.mockReturnValue(1100);
  act(() => mockAnimationFrameCallback(1100));

  expect(result.current).toBe(3);
});

it('Should call callback with calculated fps', () => {
  const callback = vi.fn();

  const { result } = renderHook(() => useFps(callback));

  mockPerformanceNow.mockReturnValue(1000);
  act(() => mockAnimationFrameCallback(1000));

  expect(result.current).toBe(1);
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(1);
});

it('Should recalculate fps for each measurement interval', () => {
  const { result } = renderHook(useFps);

  mockPerformanceNow.mockReturnValue(500);
  act(() => mockAnimationFrameCallback(500));
  mockPerformanceNow.mockReturnValue(1000);
  act(() => mockAnimationFrameCallback(1000));

  expect(result.current).toBe(2);

  mockPerformanceNow.mockReturnValue(1250);
  act(() => mockAnimationFrameCallback(1250));
  mockPerformanceNow.mockReturnValue(1500);
  act(() => mockAnimationFrameCallback(1500));
  mockPerformanceNow.mockReturnValue(1750);
  act(() => mockAnimationFrameCallback(1750));
  mockPerformanceNow.mockReturnValue(2000);
  act(() => mockAnimationFrameCallback(2000));

  expect(result.current).toBe(4);
});

it('Should use latest callback', () => {
  const initialCallback = vi.fn();
  const callback = vi.fn();
  const { rerender } = renderHook((currentCallback) => useFps(currentCallback), {
    initialProps: initialCallback
  });

  rerender(callback);

  mockPerformanceNow.mockReturnValue(1000);
  act(() => mockAnimationFrameCallback(1000));

  expect(initialCallback).not.toHaveBeenCalled();
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(1);
});

it('Should cleanup on unmount', () => {
  const mockCancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
  const { unmount } = renderHook(useFps);

  unmount();

  expect(mockCancelAnimationFrame).toHaveBeenCalledOnce();
});
