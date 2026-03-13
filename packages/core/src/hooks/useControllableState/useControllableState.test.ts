import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useControllableState } from './useControllableState';

it('Should use controllable state', () => {
  const { result } = renderHook(() => useControllableState({ initialValue: 'value' }));
  const [value, setValue, isControlled] = result.current;

  expect(value).toBe('value');
  expect(setValue).toBeTypeOf('function');
  expect(isControlled).toBeFalsy();
});

it('Should use controllable state on server side', () => {
  const { result } = renderHookServer(() => useControllableState({ initialValue: 'value' }));
  const [value, setValue, isControlled] = result.current;

  expect(value).toBe('value');
  expect(setValue).toBeTypeOf('function');
  expect(isControlled).toBeFalsy();
});

it('Should update internal state in uncontrolled mode', () => {
  const { result } = renderHook(() => useControllableState({ initialValue: 'value' }));
  const [, setValue] = result.current;

  act(() => setValue('updated'));

  expect(result.current[0]).toBe('updated');
});

it('Should work with function updates in uncontrolled mode', () => {
  const { result } = renderHook(() => useControllableState({ initialValue: 1 }));
  const [, setValue] = result.current;

  act(() => setValue((prev) => prev + 1));

  expect(result.current[0]).toBe(2);
});

it('Should call onChange when state changes in uncontrolled mode', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useControllableState({ initialValue: 'value', onChange }));
  const [, setValue] = result.current;

  act(() => setValue('updated'));

  expect(onChange).toHaveBeenCalledWith('updated');
});

it('Should use provided value in controlled mode', () => {
  const { result } = renderHook(() =>
    useControllableState({ value: 'controlled', initialValue: 'value' })
  );
  const [value, , isControlled] = result.current;

  expect(value).toBe('controlled');
  expect(isControlled).toBeTruthy();
});

it('Should not update internal state in controlled mode', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useControllableState({ value: 'controlled', onChange }));

  const [, setValue] = result.current;

  act(() => setValue('new value'));

  expect(result.current[0]).toBe('controlled');
  expect(onChange).toHaveBeenCalledWith('new value');
});

it('Should update when value prop changes in controlled mode', () => {
  const { result, rerender } = renderHook((value) => useControllableState({ value }), {
    initialProps: 'initial'
  });

  expect(result.current[0]).toBe('initial');

  rerender('updated');

  expect(result.current[0]).toBe('updated');
});

it('Should maintain stable references for callbacks', () => {
  const { result, rerender } = renderHook(() => useControllableState({ initialValue: 'value' }));

  const firstSetValue = result.current[1];

  rerender();

  const secondSetValue = result.current[1];

  expect(firstSetValue).toBe(secondSetValue);
});
