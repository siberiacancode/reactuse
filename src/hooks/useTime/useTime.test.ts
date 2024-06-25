import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useTime } from './useTime';

vi.useFakeTimers().setSystemTime(new Date('1999-03-12'));

it('Should use time', () => {
  const { result } = renderHook(useTime);

  expect(result.current.year).toBe(1999);
  expect(result.current.month).toBe(3);
  expect(result.current.day).toBe(12);
  expect(result.current.hours).toBe(3);
  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(0);
  expect(result.current.meridiemHours.value).toBe(3);
  expect(result.current.meridiemHours.type).toBe('am');
  expect(result.current.timestamp).toBe(921196800000);
});

it('Should updates every second', () => {
  const { result } = renderHook(useTime);
  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(0);

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.minutes).toBe(0);
  expect(result.current.seconds).toBe(1);

  act(() => vi.advanceTimersByTime(59_000));

  expect(result.current.minutes).toBe(1);
  expect(result.current.seconds).toBe(0);
});
