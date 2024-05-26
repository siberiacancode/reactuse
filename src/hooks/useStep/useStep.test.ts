import { act, renderHook } from '@testing-library/react';

import { useStep } from './useStep';

const STEPS_MOCK = ['1', '2', '3'];

it('Should use step', () => {
  const { result } = renderHook(() => useStep(STEPS_MOCK.length));

  expect(result.current.currentStep).toBe(1);
  expect(result.current.counts).toBe(STEPS_MOCK.length);
  expect(typeof result.current.isFirst).toBe(true);
  expect(typeof result.current.isLast).toBe(false);
  expect(typeof result.current.next).toBe('function');
  expect(typeof result.current.back).toBe('function');
  expect(typeof result.current.reset).toBe('function');
});

it('Should increase the step (params as number)', () => {
  const { result } = renderHook(() => useStep(STEPS_MOCK.length));

  act(() => result.current.next());
  expect(result.current.currentStep).toBe(2);
});

it('Should increase the step (params as object)', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.next());
  expect(result.current.currentStep).toBe(INITIAL_STEP + 1);
});

it('Should not increase the step', () => {
  const INITIAL_STEP = STEPS_MOCK.length;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.next());
  expect(result.current.currentStep).toBe(INITIAL_STEP);
});

it('Should decrease the step', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.back());
  expect(result.current.currentStep).toBe(STEPS_MOCK.length - 1);
});

it('Should not decrease the step', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.back());
  expect(result.current.currentStep).toBe(INITIAL_STEP);
});

it('Should reset to the initial step', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.next());
  expect(result.current.currentStep).toBe(INITIAL_STEP + 1);

  act(() => result.current.reset());
  expect(result.current.currentStep).toBe(INITIAL_STEP);
});

it('Should reset to the initial step', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.next());
  expect(result.current.currentStep).toBe(INITIAL_STEP + 1);

  act(() => result.current.reset());
  expect(result.current.currentStep).toBe(INITIAL_STEP);
});

it('Should set custom step', () => {
  const INITIAL_STEP = 1;
  const CUSTOM_STEP = 2;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  act(() => result.current.set(CUSTOM_STEP));
  expect(result.current.currentStep).toBe(CUSTOM_STEP);

  act(() => result.current.set('first'));
  expect(result.current.currentStep).toBe(INITIAL_STEP);

  act(() => result.current.set('last'));
  expect(result.current.currentStep).toBe(STEPS_MOCK.length);
});

it('Should have valid booleans', () => {
  const INITIAL_STEP = 1;
  const { result } = renderHook(() => useStep({ initial: INITIAL_STEP, max: STEPS_MOCK.length }));

  expect(result.current.isFirst).toBe(true);
  expect(result.current.isLast).toBe(false);

  act(() => result.current.next());
  act(() => result.current.next());
  expect(result.current.isFirst).toBe(false);
  expect(result.current.isLast).toBe(true);

  act(() => result.current.reset());
  expect(result.current.isFirst).toBe(true);
  expect(result.current.isLast).toBe(false);
});
