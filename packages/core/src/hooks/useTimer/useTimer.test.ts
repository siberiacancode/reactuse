import { act, renderHook } from '@testing-library/react';

import { getTimeFromSeconds, useTimer } from './useTimer';

const ONE_MINUTE_FIVE_SECONDS = 65000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
});

describe('getTimeFromSeconds', () => {
  it('Should convert seconds to time units', () => {
    const result = getTimeFromSeconds(90061);

    expect(result.days).toBe(1);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(1);
  });

  it('Should handle zero seconds', () => {
    const result = getTimeFromSeconds(0);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('Should handle only seconds', () => {
    const result = getTimeFromSeconds(45);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(45);
  });

  it('Should handle only minutes and seconds', () => {
    const result = getTimeFromSeconds(185);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(3);
    expect(result.seconds).toBe(5);
  });

  it('Should handle only hours, minutes and seconds', () => {
    const result = getTimeFromSeconds(7384);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(3);
    expect(result.seconds).toBe(4);
  });

  it('Should round up decimal seconds', () => {
    const result = getTimeFromSeconds(60.4);

    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(1);
  });
});

it('Should initialize with correct values', () => {
  const { result } = renderHook(() => useTimer(ONE_MINUTE_FIVE_SECONDS));

  expect(result.current.seconds).toBe(5);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(0);
  expect(result.current.days).toBe(0);
  expect(result.current.running).toBeTruthy();
});

it('Should initialize with autostart false', () => {
  const { result } = renderHook(() => useTimer(ONE_MINUTE_FIVE_SECONDS, { autostart: false }));

  expect(result.current.running).toBeFalsy();
});

it('Should decrease time when running', () => {
  const { result } = renderHook(() => useTimer(ONE_MINUTE_FIVE_SECONDS));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(4);
  expect(result.current.minutes).toBe(1);

  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(59);
  expect(result.current.minutes).toBe(0);
});

it('Should call onExpire when timer ends', () => {
  const onExpire = vi.fn();
  const { result } = renderHook(() => useTimer(2000, { onExpire }));

  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(0);
  expect(result.current.running).toBeFalsy();
  expect(onExpire).toBeCalledTimes(1);
});

it('Should call onTick on each second', () => {
  const onTick = vi.fn();
  renderHook(() => useTimer(3000, { onTick }));

  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());

  expect(onTick).toBeCalledTimes(2);
});

it('Should pause timer', () => {
  const { result } = renderHook(() => useTimer(10000));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(9);

  act(() => {
    result.current.pause();
  });

  act(() => vi.advanceTimersToNextTimer());
  expect(result.current.seconds).toBe(9);
  expect(result.current.running).toBeFalsy();
});

it('Should toggle timer state', () => {
  const { result } = renderHook(() => useTimer(10000));

  act(() => {
    result.current.toggle();
  });
  expect(result.current.running).toBeFalsy();

  act(() => {
    result.current.toggle();
  });
  expect(result.current.running).toBeTruthy();
});

it('Should restart timer with new time', () => {
  const { result } = renderHook(() => useTimer(10000));

  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());
  expect(result.current.seconds).toBe(8);

  act(() => {
    result.current.restart(5000);
  });

  expect(result.current.seconds).toBe(5);
  expect(result.current.running).toBeTruthy();
});

it('Should restart timer with autostart false', () => {
  const { result } = renderHook(() => useTimer(10000));

  act(() => {
    result.current.restart(5000, false);
  });

  expect(result.current.seconds).toBe(5);
  expect(result.current.running).toBeFalsy();
});

it('Should start timer', () => {
  const { result } = renderHook(() => useTimer(10000, { autostart: false }));

  expect(result.current.running).toBeFalsy();

  act(() => {
    result.current.start();
  });

  expect(result.current.running).toBeTruthy();
  expect(result.current.seconds).toBe(10);
});

it('Should accept callback as second parameter', () => {
  const callback = vi.fn();
  renderHook(() => useTimer(2000, callback));

  act(() => vi.advanceTimersToNextTimer());
  act(() => vi.advanceTimersToNextTimer());

  expect(callback).toBeCalledTimes(1);
});
