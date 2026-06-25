import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useValidatedState } from './useValidatedState';

it('Should use validated state', () => {
  const { result } = renderHook(() => useValidatedState('test', (value) => value === 'test'));
  const [state, setValue] = result.current;

  expect(state).toEqual({
    lastValidValue: 'test',
    valid: true,
    value: 'test'
  });
  expect(setValue).toBeTypeOf('function');
});

it('Should use validated state on server side', () => {
  const { result } = renderHookServer(() => useValidatedState('test', (value) => value === 'test'));
  const [state, setValue] = result.current;

  expect(state).toEqual({
    lastValidValue: 'test',
    valid: true,
    value: 'test'
  });
  expect(setValue).toBeTypeOf('function');
});

it('Should set initial invalid state', () => {
  const { result } = renderHook(() => useValidatedState('test', (value) => value === 'tests'));
  const [state, setValue] = result.current;

  expect(state).toEqual({
    lastValidValue: undefined,
    valid: false,
    value: 'test'
  });
  expect(setValue).toBeTypeOf('function');
});

it('Should use the initial validation state when provided', () => {
  const { result } = renderHook(() =>
    useValidatedState('test', (value) => value === 'other', true)
  );
  const [validState] = result.current;

  expect(validState.valid).toBeTruthy();
});

it('Should update the last valid value', () => {
  const { result } = renderHook(() => useValidatedState('start', (value) => value.length > 3));
  const [, setValue] = result.current;

  act(() => setValue('no'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'start',
    valid: false,
    value: 'no'
  });

  act(() => setValue('valid-again'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'valid-again',
    valid: true,
    value: 'valid-again'
  });
});

it('Should preserve the last valid value through invalid updates', () => {
  const { result } = renderHook(() => useValidatedState('good', (value) => value === 'good'));
  const [, setValue] = result.current;

  act(() => setValue('bad'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'good',
    valid: false,
    value: 'bad'
  });
});
