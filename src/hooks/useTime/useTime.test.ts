import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useTime } from './useTime';

vi.useFakeTimers();

describe('useTime', () => {
  it('returns the current time', () => {
    const { result } = renderHook(() => useTime());
    expect(result.current).toEqual(
      expect.objectContaining({
        seconds: expect.any(Number),
        minutes: expect.any(Number),
        hours: expect.any(Number),
        meridiemHours: expect.objectContaining({
          value: expect.any(Number),
          type: expect.any(String)
        }),
        day: expect.any(Number),
        month: expect.any(Number),
        year: expect.any(Number),
        timestamp: expect.any(Number)
      })
    );
  });

  it('updates every second', () => {
    const { result } = renderHook(() => useTime());
    const initialTime = result.current;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).not.toEqual(initialTime);
  });
});
