import { act, renderHook } from '@testing-library/react';

import { useWizard } from './useWizard';

const WIZARD_MAP = [
  { id: '1', nodes: ['2'] },
  { id: '2', nodes: ['1', '3'] },
  { id: '3', nodes: [] }
];

it('Should use wizard', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP));

  expect(result.current.currentStepId).toBe('1');
  expect(result.current.history).toEqual(['1']);
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.back).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
});

it('Should use wizard with initial step', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP, '2'));

  expect(result.current.currentStepId).toBe('2');
  expect(result.current.history).toEqual(['2']);
});

it('Should set next step', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP));

  act(() => result.current.set('2'));
  act(() => result.current.set('3'));

  expect(result.current.currentStepId).toBe('3');
  expect(result.current.history).toEqual(['1', '2', '3']);
});

it('Should go back', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP));

  act(() => result.current.set('2'));

  expect(result.current.currentStepId).toBe('2');
  expect(result.current.history).toEqual(['1', '2']);

  act(() => result.current.back());

  expect(result.current.currentStepId).toBe('1');
  expect(result.current.history).toEqual(['1']);
});

it('Should reset wizard', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP));

  act(() => result.current.set('2'));

  act(() => result.current.reset());

  expect(result.current.currentStepId).toBe('1');
  expect(result.current.history).toEqual(['1']);
});

it('Should throw on invalid transition', () => {
  const { result } = renderHook(() => useWizard(WIZARD_MAP));

  expect(() => act(() => result.current.set('3'))).toThrow("Can't go to 3 from 1");
});
