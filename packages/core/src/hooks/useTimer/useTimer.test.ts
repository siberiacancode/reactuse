import { act, renderHook } from '@testing-library/react';

import { getTimeFromSeconds, useTimer } from './useTimer';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
});

vi.useFakeTimers().setSystemTime(new Date('1999-03-12'));

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

it('Should use timer', () => {
  const { result } = renderHook(() => useTimer(65));

  expect(result.current.seconds).toBe(5);
  expect(result.current.minutes).toBe(1);
  expect(result.current.hours).toBe(0);
  expect(result.current.days).toBe(0);
  expect(result.current.count).toBe(65);
  expect(result.current.active).toBeTruthy();
  expect(result.current.restart).toBeTypeOf('function');
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.pause).toBeTypeOf('function');
  expect(result.current.resume).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
  expect(result.current.increase).toBeTypeOf('function');
  expect(result.current.decrease).toBeTypeOf('function');
});

it('Should use timer without params', () => {
  const { result } = renderHook(useTimer);

  expect(result.current.seconds).toBe(0);
  expect(result.current.minutes).toBe(0);
  expect(result.current.hours).toBe(0);
  expect(result.current.days).toBe(0);
  expect(result.current.count).toBe(0);
  expect(result.current.active).toBeFalsy();
});

it('Should call callback when timer ends', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useTimer(1, callback));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(0);
  expect(result.current.active).toBeFalsy();
  expect(callback).toHaveBeenCalledOnce();
});

it('Should not be active when disabled', () => {
  const { result } = renderHook(() => useTimer(1, { immediately: false }));

  expect(result.current.active).toBeFalsy();
});

it('Should correct handle negative seconds', () => {
  const { result } = renderHook(() => useTimer(-1));

  expect(result.current.active).toBeFalsy();
  expect(result.current.count).toBe(0);
});

it('Should decrease time when running', async () => {
  const { result } = renderHook(() => useTimer(60));

  expect(result.current.seconds).toBe(0);
  expect(result.current.minutes).toBe(1);

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(59);
  expect(result.current.minutes).toBe(0);
});

it('Should update timer if value is changed', () => {
  const { result, rerender } = renderHook((props: number) => useTimer(props));

  expect(result.current.seconds).toBe(0);
  expect(result.current.active).toBeFalsy();

  rerender(10);

  expect(result.current.seconds).toBe(10);
  expect(result.current.active).toBeTruthy();

  rerender(0);

  expect(result.current.seconds).toBe(0);
  expect(result.current.active).toBeFalsy();
});

it('Should call onExpire when timer ends', () => {
  const onExpire = vi.fn();
  const { result } = renderHook(() => useTimer(1, { onExpire }));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(0);
  expect(result.current.active).toBeFalsy();
  expect(onExpire).toHaveBeenCalledOnce();
});

it('Should call onStart when timer starts', () => {
  const onStart = vi.fn();
  const { result } = renderHook(() => useTimer(1, { onStart }));

  expect(onStart).toHaveBeenCalledOnce();

  act(result.current.pause);
  act(result.current.resume);

  expect(onStart).toBeCalledTimes(2);
});

it('Should call onTick on each second', () => {
  const onTick = vi.fn();
  renderHook(() => useTimer(2, { onTick }));

  act(() => vi.advanceTimersToNextTimer());

  expect(onTick).toHaveBeenCalledOnce();
  expect(onTick).toBeCalledWith(2);

  act(() => vi.advanceTimersToNextTimer());

  expect(onTick).toBeCalledTimes(2);
  expect(onTick).toBeCalledWith(1);
});

it('Should pause timer', () => {
  const { result } = renderHook(() => useTimer(11));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.active).toBeTruthy();
  expect(result.current.seconds).toBe(10);

  act(result.current.pause);

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(10);
  expect(result.current.active).toBeFalsy();
});

it('Should toggle timer state', () => {
  const { result } = renderHook(() => useTimer(1));

  act(result.current.toggle);

  expect(result.current.active).toBeFalsy();

  act(result.current.toggle);

  expect(result.current.active).toBeTruthy();

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.active).toBeFalsy();

  act(result.current.toggle);

  expect(result.current.active).toBeFalsy();
});

it('Should restart timer with new time', () => {
  const { result } = renderHook(() => useTimer(11));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.seconds).toBe(10);

  act(() => result.current.restart(6));

  expect(result.current.seconds).toBe(6);
  expect(result.current.active).toBeTruthy();
});

it('Should start timer', () => {
  const { result } = renderHook(() => useTimer(11));

  act(() => vi.advanceTimersToNextTimer());
  expect(result.current.seconds).toBe(10);

  act(result.current.start);

  act(() => vi.advanceTimersToNextTimer());
  expect(result.current.seconds).toBe(10);
});

it('Should not start timer if seconds are less than 0', () => {
  const { result } = renderHook(useTimer);

  act(result.current.start);

  expect(result.current.active).toBeFalsy();
  expect(result.current.seconds).toBe(0);
});

it('Should resume timer', () => {
  const { result } = renderHook(() => useTimer(11, { immediately: false }));

  expect(result.current.active).toBeFalsy();

  act(result.current.resume);

  expect(result.current.active).toBeTruthy();
});

it('Should restart timer by method', () => {
  const { result } = renderHook(() => useTimer(11));

  act(() => result.current.restart(6));
  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.active).toBeTruthy();
  expect(result.current.seconds).toBe(5);
});

it('Should clear timer', () => {
  const { result } = renderHook(() => useTimer(11));

  act(result.current.clear);

  expect(result.current.active).toBeFalsy();
  expect(result.current.seconds).toBe(0);
});

it('Should increase timer', () => {
  const { result } = renderHook(() => useTimer(10));

  act(() => result.current.increase(5));

  expect(result.current.seconds).toBe(15);
});

it('Should decrease timer', () => {
  const { result } = renderHook(() => useTimer(10));

  act(() => result.current.decrease(5));

  expect(result.current.seconds).toBe(5);

  act(() => result.current.decrease(10));

  expect(result.current.seconds).toBe(0);
  expect(result.current.active).toBeFalsy();
});

it('Should restart timer by method with immediately false', () => {
  const { result } = renderHook(() => useTimer(10, { immediately: false }));

  act(() => result.current.restart(5, false));

  act(() => vi.advanceTimersToNextTimer());

  expect(result.current.active).toBeFalsy();
  expect(result.current.seconds).toBe(5);
});

it('Should accept callback as second parameter', () => {
  const callback = vi.fn();
  renderHook(() => useTimer(1, callback));

  act(() => vi.advanceTimersToNextTimer());

  expect(callback).toHaveBeenCalledOnce();
});
