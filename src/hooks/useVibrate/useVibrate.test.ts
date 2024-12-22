import { act, renderHook } from '@testing-library/react';

import { useVibrate } from './useVibrate';

const vibrateMock = vi.fn();

describe('useVibrate', () => {
  beforeAll(() => {
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      value: vibrateMock
    });
  });

  it('should indicate support for vibration API', () => {
    const { result } = renderHook(() => useVibrate(1000));

    expect(result.current.isSupported).toBe(true);
  });

  it('should start and stop vibration', () => {
    const { result } = renderHook(() => useVibrate(1000));

    act(() => {
      result.current.vibrate();
    });

    expect(vibrateMock).toHaveBeenCalledWith(1000);
    expect(result.current.isVibrating).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(vibrateMock).toHaveBeenCalledWith(0);
    expect(result.current.isVibrating).toBe(false);
  });

  it('should handle looped vibration', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useVibrate({ pattern: [200, 100, 200], loop: true }));

    act(() => {
      result.current.vibrate();
    });

    expect(vibrateMock).toHaveBeenCalledWith([200, 100, 200]);
    expect(result.current.isVibrating).toBe(true);

    vi.advanceTimersByTime(500);

    expect(vibrateMock).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.stop();
    });

    expect(vibrateMock).toHaveBeenCalledWith(0);
    expect(result.current.isVibrating).toBe(false);

    vi.useRealTimers();
  });

  it('should respect the enabled parameter', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useVibrate({ pattern: [200, 100, 200], enabled }),
      {
        initialProps: { enabled: false }
      }
    );

    expect(result.current.isVibrating).toBe(false);

    rerender({ enabled: true });

    expect(result.current.isVibrating).toBe(true);
    expect(vibrateMock).toHaveBeenCalledWith([200, 100, 200]);

    rerender({ enabled: false });

    expect(result.current.isVibrating).toBe(false);
    expect(vibrateMock).toHaveBeenCalledWith(0);
  });
});
