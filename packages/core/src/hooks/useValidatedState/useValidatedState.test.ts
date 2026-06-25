import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useValidatedState } from './useValidatedState';

it('Should return the initial valid state', () => {
  const { result } = renderHook(() => useValidatedState('test', (value) => value === 'test'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'test',
    valid: true,
    value: 'test'
  });
  expect(result.current[1]).toBeTypeOf('function');
});

it('Should return the initial invalid state', () => {
  const { result } = renderHook(() => useValidatedState('test', (value) => value === 'tests'));

  expect(result.current[0]).toEqual({
    lastValidValue: undefined,
    valid: false,
    value: 'test'
  });
  expect(result.current[1]).toBeTypeOf('function');
});

it('Should use validated state on server side', () => {
  const { result } = renderHookServer(() => useValidatedState('test', (value) => value === 'test'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'test',
    valid: true,
    value: 'test'
  });
  expect(result.current[1]).toBeTypeOf('function');
});

it('Should use the initial validation state when provided', () => {
  const { result: invalidResult } = renderHook(() =>
    useValidatedState('test', (value) => value === 'other', false)
  );
  const { result: validResult } = renderHook(() =>
    useValidatedState('test', (value) => value === 'other', true)
  );

  expect(invalidResult.current[0].valid).toBeFalsy();
  expect(validResult.current[0].valid).toBeTruthy();
});

it('Should update the last valid value after invalid values', () => {
  const { result } = renderHook(() => useValidatedState('start', (value) => value.length > 3));

  act(() => result.current[1]('no'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'start',
    valid: false,
    value: 'no'
  });

  act(() => result.current[1]('valid-again'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'valid-again',
    valid: true,
    value: 'valid-again'
  });
});

it('Should preserve the last valid value through invalid updates', () => {
  const { result } = renderHook(() => useValidatedState('good', (value) => value === 'good'));

  act(() => result.current[1]('bad-1'));
  act(() => result.current[1]('bad-2'));

  expect(result.current[0]).toEqual({
    lastValidValue: 'good',
    valid: false,
    value: 'bad-2'
  });
});
