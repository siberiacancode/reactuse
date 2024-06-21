import { act, renderHook } from '@testing-library/react';

import { useStep } from './useStep';

const STEPS = ['1', '2', '3'];

it('Should use step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  expect(result.current.currentStep).toBe(1);
  expect(result.current.counts).toBe(3);
  expect(result.current.isFirst).toBeTruthy();
  expect(result.current.isLast).toBeFalsy();
  expect(typeof result.current.next).toBe('function');
  expect(typeof result.current.back).toBe('function');
  expect(typeof result.current.reset).toBe('function');
});

it('Should increase the step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  act(result.current.next);
  expect(result.current.currentStep).toBe(2);
});

it('Should not increase the step when max is reached', () => {
  const { result } = renderHook(() => useStep(1));

  act(result.current.next);
  expect(result.current.currentStep).toBe(1);
});

it('Should decrease the step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  act(result.current.next);
  expect(result.current.currentStep).toBe(2);

  act(result.current.back);
  expect(result.current.currentStep).toBe(1);
});

it('Should not decrease the step when min is reached', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  act(result.current.back);
  expect(result.current.currentStep).toBe(1);
});

it('Should reset to the initial step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  act(() => result.current.set(3));
  expect(result.current.currentStep).toBe(3);

  act(() => result.current.reset());
  expect(result.current.currentStep).toBe(1);
});

it('Should have valid booleans', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  expect(result.current.isFirst).toBeTruthy();
  expect(result.current.isLast).toBeFalsy();

  act(result.current.next);
  expect(result.current.isFirst).toBeFalsy();
  expect(result.current.isLast).toBeFalsy();

  act(result.current.next);
  expect(result.current.isFirst).toBeFalsy();
  expect(result.current.isLast).toBeTruthy();

  act(() => result.current.reset());
  expect(result.current.isFirst).toBeTruthy();
  expect(result.current.isLast).toBeFalsy();
});

it('Should set custom step', () => {
  const { result } = renderHook(() => useStep(STEPS.length));

  act(() => result.current.set(2));
  expect(result.current.currentStep).toBe(2);

  act(() => result.current.set('first'));
  expect(result.current.currentStep).toBe(1);

  act(() => result.current.set('last'));
  expect(result.current.currentStep).toBe(3);

  act(() => result.current.set(Number.POSITIVE_INFINITY));
  expect(result.current.currentStep).toBe(3);

  act(() => result.current.set(Number.NEGATIVE_INFINITY));
  expect(result.current.currentStep).toBe(1);
});

describe('Value is object', () => {
  it('Should increase the step', () => {
    const { result } = renderHook(() => useStep({ initial: 1, max: STEPS.length }));

    act(result.current.next);
    expect(result.current.currentStep).toBe(2);
  });

  it('Should not increase the step when max is reached', () => {
    const INITIAL_STEP = STEPS.length;
    const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS.length }));

    act(result.current.next);
    expect(result.current.currentStep).toBe(STEPS.length);
  });

  it('Should decrease the step', () => {
    const { result } = renderHook(() => useStep({ initial: 1, max: STEPS.length }));

    act(result.current.next);
    expect(result.current.currentStep).toBe(2);

    act(result.current.back);
    expect(result.current.currentStep).toBe(1);
  });

  it('Should not decrease the step when min is reached', () => {
    const { result } = renderHook(() => useStep({ initial: 1, max: STEPS.length }));

    act(result.current.back);
    expect(result.current.currentStep).toBe(1);
  });

  it('Should reset to the initial step', () => {
    const { result } = renderHook(() => useStep({ initial: 2, max: STEPS.length }));

    act(() => result.current.set(3));
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.reset());
    expect(result.current.currentStep).toBe(2);
  });

  it('Should have valid booleans', () => {
    const { result } = renderHook(() => useStep({ initial: 1, max: STEPS.length }));

    expect(result.current.isFirst).toBeTruthy();
    expect(result.current.isLast).toBeFalsy();

    act(result.current.next);
    expect(result.current.isFirst).toBeFalsy();
    expect(result.current.isLast).toBeFalsy();

    act(result.current.next);
    expect(result.current.isFirst).toBeFalsy();
    expect(result.current.isLast).toBeTruthy();

    act(() => result.current.reset());
    expect(result.current.isFirst).toBeTruthy();
    expect(result.current.isLast).toBeFalsy();
  });

  it('Should set custom step', () => {
    const { result } = renderHook(() => useStep({ initial: 1, max: STEPS.length }));

    act(() => result.current.set(2));
    expect(result.current.currentStep).toBe(2);

    act(() => result.current.set('first'));
    expect(result.current.currentStep).toBe(1);

    act(() => result.current.set('last'));
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.set(Number.POSITIVE_INFINITY));
    expect(result.current.currentStep).toBe(3);

    act(() => result.current.set(Number.NEGATIVE_INFINITY));
    expect(result.current.currentStep).toBe(1);
  });
});
